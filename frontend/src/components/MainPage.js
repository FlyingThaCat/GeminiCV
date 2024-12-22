import { useEffect } from "react";
import { VStack } from '@chakra-ui/react';
import Header from './Header';
import About from './About';
import Chat from './Chat';
import Contact from './Contact';
import Footer from './Footer';
import Theme from './Theme';
import axios from "axios";
import { useStore } from "../store";  // Import the store

export const MainPage = () => {
  const { setInfo } = useStore();

  useEffect(() => {
    // Fetch data from the server and update the store
    axios.get("http://localhost:5000/info").then((response) => {
      if (response.data.linkedin && response.data.linkedin.startsWith("@")){
        response.data.instagram = response.data.linkedin;
        response.data.linkedin = ""
      }
      console.log(response.data);
      setInfo(response.data);
    });
  }, [setInfo]);

  return (
    <VStack pt={2}>
      <Theme />
      <Header />
      <About />
      <Chat />
      <Contact />
      <Footer />
    </VStack>
  );
};
