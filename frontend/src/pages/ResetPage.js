import {
    Box,
    Button,
    VStack,
    PinInput,
    PinInputField,
    Alert,
    AlertIcon,
    useColorModeValue,
    useToast,
    HStack,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
  } from "@chakra-ui/react";
  import { useState, useRef, useEffect } from "react";
  
  export const ResetPage = () => {
      const [resetCode, setResetCode] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const cancelRef = useRef();
      const toast = useToast();
      const openDialog = () => setIsDialogOpen(true);
      const closeDialog = () => setIsDialogOpen(false);
      const [countdown, setCountdown] = useState(5);
      const [success, setSuccess] = useState(false);
      
    const handleSubmit = async () => {
      if (resetCode.length !== 18) {
        toast({
          title: "Invalid Code",
          description: "Please enter a valid 18-character reset code.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        const response = await fetch("http://localhost:5000/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reset_code: resetCode }),
        });
  
        const data = await response.json(); // Parse JSON response
  
        if (response.ok) {
          setSuccess(true);
          toast({
            title: "Success",
            description: "Reset code has been successfully submitted.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.status === 400 && data.error === "Reset code is incorrect") {
          toast({
            title: "Error",
            description: "Invalid reset code. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to submit reset code. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error submitting reset code:", error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
        setIsDialogOpen(false);
      }
    };
  
  
    useEffect(() => {
       if (isDialogOpen && countdown > 0) {
         const timer = setInterval(() => {
           setCountdown((prevCountdown) => prevCountdown - 1);
         }, 1000);
         return () => clearInterval(timer); // Clear interval on unmount
       }
    }, [isDialogOpen, countdown]);

    useEffect(() => {
        if (success && countdown > 0) {
          const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);
      
          return () => clearInterval(timer); // Clear interval on unmount
        }
      
        if (success && countdown === 0) {
          window.location.href = "/"; // Redirect to the home page
        }
    }, [success, countdown]);
      

    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("gray.100", "gray.800")}
        p={4}
      >
        <Box
          color="white"
          p={6}
          borderRadius="md"
          boxShadow="lg"
          maxW="500px"
          w="full"
          _dark={{ bg: "gray.700" }}
          textAlign="center"
        >
          <Alert status="error" my={4}>
            <AlertIcon />
            This will reset the website to its default state. Are you sure?
          </Alert>
          <VStack spacing={4}>
            <HStack wrap="wrap" justifyContent="center" gap={2}>
              <PinInput
                type="alphanumeric"
                size="lg"
                onChange={(value) => setResetCode(value)}
                isDisabled={isSubmitting}
              >
                {Array(18)
                  .fill("")
                  .map((_, idx) => (
                    <PinInputField key={idx} />
                  ))}
              </PinInput>
            </HStack>
            <Button
              colorScheme="red"
              width="full"
              mt={6}
              onClick={openDialog}
              isLoading={isSubmitting}
              loadingText="Submitting"
              isDisabled={resetCode.length !== 18 || isSubmitting}
            >
              Submit Reset Code
            </Button>
          </VStack>
  
          <AlertDialog
              isOpen={isDialogOpen}
              leastDestructiveRef={cancelRef}
              onClose={closeDialog}
            >
              <AlertDialogOverlay
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Confirm Reset
                  </AlertDialogHeader>
                  {success ? (
                    <Alert status="success" my={4}>
                      <AlertIcon />
                      Refreshing in {countdown} seconds...
                    </Alert>
                  ) : (
                    <AlertDialogBody>
                      Are you sure you want to reset the website? This action cannot be undone.
                    </AlertDialogBody>
                  )}
                  <AlertDialogFooter>
                    {!success && (
                      <>
                        <Button ref={cancelRef} onClick={closeDialog}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleSubmit}
                          ml={3}
                          isLoading={isSubmitting}
                          disabled={countdown > 0}
                          loadingText="Submitting"
                        >
                          Confirm {countdown > 0 ? `(${countdown})` : ""}
                        </Button>
                      </>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
        </Box>
      </Box>
    );
  };
  