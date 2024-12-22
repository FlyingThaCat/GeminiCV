import React, { use } from "react";
import {
  Image,
  Container,
  Flex,
  Stack,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import styled from "styled-components";
import { useStore } from "../store";

const AboutSection = styled.div`
   #about-container{
    display: flex;
    flex-direction: column;
   } 
    @media only screen and (min-width: 950px) {
        #about-container{
            flex-direction: row
            
        }
    }
}
`;

function About() {
  // get the data from zustand store
  const { about, education } = useStore();

  return (
    <Stack py={20} pb={5}>
      <AboutSection>
        <Flex id="about-container">
          <Flex alignItems="center" justifyContent="center" mb={8}>
            {/* <Image
              borderRadius="full"
              boxSize="300px"
              src=""
            /> */}
          </Flex>
          <Box>
            <Container>
              <Text fontSize="3xl" fontWeight="bold">
                About Me
              </Text>
              <Text fontSize="5x1">
                {about}  
              </Text>
              <br />
              <VStack spacing="3px" align="start">
                <Text fontSize="3xl" fontWeight="bold">
                  Education
                </Text>
                { education.map((item, index) => (
                  <Text fontSize="5x1" key={index}>
                    {item}
                  </Text>
                ))}
              </VStack>
            </Container>
          </Box>
        </Flex>
      </AboutSection>
    </Stack>
  );
}

export default About;
