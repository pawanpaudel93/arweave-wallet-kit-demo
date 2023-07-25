import {
  Container,
  Flex,
  Box,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FormEvent, useEffect, useState } from "react";
import "react-dropzone/examples/theme.css";
import { useApi, useConnection } from "arweave-wallet-kit";
import Arweave from "arweave";

const arweave = Arweave.init({});

function App() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { connected } = useConnection();
  const walletApi = useApi();
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] }, // Accept all image files
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <Box
      key={file.name}
      display="inline-flex"
      borderRadius={2}
      border="1px solid #eaeaea"
      marginBottom={8}
      marginRight={8}
      width={100}
      height={100}
      padding={4}
      boxSizing="border-box"
    >
      <Flex minWidth={0} overflow="hidden">
        <img
          src={file.preview}
          alt={file.name}
          style={{
            display: "block",
            width: "auto",
            height: "100%",
          }}
          // Revoke data URI after the image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </Flex>
    </Box>
  ));

  function getErrorMessage(error: unknown): string {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as Record<string, unknown>).message === "string"
    )
      return (error as { message: string }).message;

    try {
      return new Error(JSON.stringify(error)).message;
    } catch {
      return String(error);
    }
  }

  async function upload(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const promises = files.map(async (file) => {
        const data = await new Response(file).arrayBuffer();
        const transaction = await arweave.createTransaction({
          data,
        });
        transaction.addTag("App-Name", "Arweave Wallet Kit Demo");
        transaction.addTag("Content-Type", file.type);
        await walletApi?.sign(transaction);
        await arweave.transactions.post(transaction);
      });
      await Promise.all(promises);
      toast({
        title: "Success",
        description: "Uploaded sucessfully.",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      setFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        status: "error",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    // Make sure to revoke the data URIs to avoid memory leaks, this will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <Container py={8} maxW="6xl">
      <form onSubmit={void upload}>
        <VStack w="100%">
          <Box className="container" w="full">
            <Box
              {...getRootProps({ className: "dropzone" })}
              p={24}
              w="full"
              cursor="pointer"
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop some images here, or click to select images</p>
            </Box>
            <Flex flexDirection="row" flexWrap="wrap" marginTop={16}>
              {thumbs}
            </Flex>
          </Box>
          <Button
            colorScheme="blue"
            isDisabled={files.length === 0 || !connected}
            isLoading={isLoading}
            loadingText="Uploading"
            type="submit"
          >
            Upload
          </Button>
        </VStack>
      </form>
    </Container>
  );
}

export default App;
