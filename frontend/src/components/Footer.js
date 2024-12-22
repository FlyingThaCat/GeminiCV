import React from "react";
import { Center } from "@chakra-ui/react";
import styled from "styled-components";

const FooterSection = styled.div`
  height: auto;
  color: white;
  background-color: #4158d0;
  background-image: linear-gradient(to right, #fc5c7d, #6a82fb);
  width: 100%;
  position: fixed;
  bottom: 0;
`;

function Footer() {
  return (
    <FooterSection>
      <Center>
        Created using React & Chakra UI &copy; John / FlyingThaCat |{" "}
        {new Date().getFullYear()}
      </Center>
    </FooterSection>
  );
}
export default Footer;
