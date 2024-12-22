import React from 'react';
import { Box, IconButton, useMediaQuery, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

function Theme() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const [isNotSmallerScreen] = useMediaQuery("(min-width:800px)");

    return (
       <Box
            w="4rem"
            h="4rem"
            position="fixed"
            bottom={24}
            right={4}
            borderRadius="full"
            boxShadow="md"
            bg="pink.300"
            zIndex={10}
            cursor="pointer"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <IconButton
                mr={isNotSmallerScreen ? "2" : "3"}
                ml={2}
                colorScheme="white"
                icon={isDark ? <FaSun /> : <FaMoon />}
                isRound="true"
                onClick={toggleColorMode}
            ></IconButton>
        </Box>
    );
}


export default Theme;