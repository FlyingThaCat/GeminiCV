import React, { use } from "react";
import { FaLinkedin, FaGithub, FaInstagram, FaPhone } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Icon from "@chakra-ui/icon";
import { VStack, HStack } from "@chakra-ui/layout";
import { Text, Link } from "@chakra-ui/react";
import styled from "styled-components";
import { useStore } from "../store";

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  bg="#eee4ee"
  _dark={{
    bg: "#001845",
  }}
  width: 100%;

  #icons {
    transition: transform 0.2s !important;
    cursor: pointer;
  }
  #icons:hover {
    transform: scale(1.2) !important;
  }
`;

function Contact() {
  const { linkedin, github, email, phone, instagram } = useStore();
  const formatUrl = (url, platform) => {
    if (!url) return "#"; // Fallback if the URL is empty or undefined
  
    // Check if the URL starts with "http://" or "https://"
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // Format based on the platform
      switch (platform) {
        case "LinkedIn":
          if (url.match(/linkedin.com/)) return `https://${url}`;
          return `https://www.linkedin.com/in/${url}`;
        case "GitHub":
          if (url.match(/github.com/)) return `https://${url}`;
          return `https://github.com/${url}`;
        case "Instagram":
          if (url.match(/instagram.com/)) return `https://${url}`;
          return `https://www.instagram.com/${url}`;
        default:
          return `https://${url}`;
      }
    }
    
    return url;
  }  

  return (
    <ContactSection>
      <Text fontSize="4xl" fontWeight="bold" m="5">
        Contact Me!
      </Text>
        <HStack spacing="10" justifyContent="center" mb="10">
        { linkedin && (
          <Link
            id="icons"
            href={formatUrl(linkedin, "LinkedIn")}
            isExternal
            >
            <Icon
              as={FaLinkedin}
              boxSize="50"
              color="pink.500"
              _dark={{
                color: "pink.200",
              }}
              />
          </Link>
        )}
        { github && (
          <Link id="icons" href={formatUrl(github, "GitHub")} isExternal>
            <Icon
              as={FaGithub}
              boxSize="50"
              color="pink.500"
              _dark={{
                color: "pink.200",
              }}
            />
          </Link>
        )}
        { email && (
          <Link id="icons" href={`mailto:${email}`} isExternal>
            <Icon
              as={MdEmail}
              boxSize="50"
              color="pink.500"
              _dark={{
                color: "pink.200",
              }}
            />
        </Link>
        )}
        { instagram && (
          <Link
          id="icons"
          href={formatUrl(instagram, "Instagram")}
          isExternal
          >
            <Icon
              as={FaInstagram}
              boxSize="50"
              color="pink.500"
              _dark={{
                color: "pink.200",
              }}
              />
          </Link>
        )}
        { phone && (
          <Link id="icons" href={`tel:${phone}`} isExternal>
          <Icon
            as={FaPhone}
            boxSize="50"
            color="pink.500"
            _dark={{
              color: "pink.200",
            }}
          />
        </Link>
        )}
      </HStack>
    </ContactSection>
  );
}

export default Contact;
