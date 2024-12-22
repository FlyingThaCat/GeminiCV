import React, { useState, useEffect } from "react";
import { 
  Box, 
  Text, 
  Button, 
  VStack, 
  useToast, 
  Icon, 
  Alert,
  AlertIcon,
  HStack, 
  Spinner, 
  useColorModeValue 
} from "@chakra-ui/react";
import { FiUpload, FiXCircle } from "react-icons/fi";
import axios from "axios";

export const SetupPage = () => {
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown time in seconds
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const toast = useToast();

  useEffect(() => {
    document.title = "Setup - PDF Uploader";
    axios.get("http://localhost:5000/status").then((response) => {
      if (response.status === 200) {
        if (response.data.status === "Ready") {
          window.location.href = "/";
        }
      }
  })
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDeleteFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true); // Set loading state

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: "Your PDF file has been uploaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setSuccess(true);
        setFile(null); // Clear the selected file after upload
      } else {
        toast({
          title: "Upload failed",
          description: "An error occurred while uploading the file.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear interval on unmount
    } else if (countdown === 0) {
      // Redirect to the home page after the countdown
      window.location.href = "/";
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
        maxW="400px"
        _dark={{ bg: "gray.700" }}
        textAlign="center"
      >
        {success && (
          <Alert status="success" my={4}>
            <AlertIcon />
            Refreshing in {countdown} seconds...
          </Alert>
        )}
        <VStack
          spacing={4}
          borderWidth={2}
          borderStyle="dashed"
          borderColor={isDragging ? "blue.400" : "gray.500"}
          borderRadius="md"
          p={6}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          bg={isDragging ? "gray.700" : "gray.900"}
          transition="background-color 0.2s ease"
        >
          {file ? (
            <HStack justifyContent="space-between" width="100%">
              <Text fontSize="sm" color="gray.300" textAlign="left" isTruncated>
                {file.name}
              </Text>
              <Button
                variant="ghost"
                color="red.400"
                onClick={handleDeleteFile}
                size="sm"
              >
                <Icon as={FiXCircle} boxSize={5} />
              </Button>
            </HStack>
          ) : (
            <>
              <Icon as={FiUpload} boxSize={8} color="blue.300" />
              <Text fontSize="lg" fontWeight="bold">
                Drag and drop your PDF file here
              </Text>
              <Text fontSize="sm" color="gray.400">
                or click to select a file
              </Text>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  display: "none",
                }}
                id="file-input"
              />
              <Button
                as="label"
                htmlFor="file-input"
                colorScheme="blue"
                size="sm"
                cursor="pointer"
              >
                Select File
              </Button>
            </>
          )}
        </VStack>

        <Button
          colorScheme="teal"
          mt={6}
          width="full"
          onClick={handleUpload}
          isDisabled={!file || isUploading}
          leftIcon={isUploading ? <Spinner size="sm" /> : null}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </Box>
    </Box>
  );
};
