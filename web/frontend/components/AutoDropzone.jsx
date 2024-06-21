import {
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Button,
} from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { useAuthenticatedFetch } from "../hooks";

function AutoDropzone() {
  const [files, setFiles] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleDropZoneDrop = () => {
    setFiles((files) => [...files, ...acceptedFiles]);
  };

  const handleConfirmationModal = (files, acceptedFiles, _rejectedFiles) => {
    setIsOpen(true);
    setAcceptedFiles(acceptedFiles);
    setRejectedFiles(_rejectedFiles);
  };

  const importData = async () => {
    const importedFiles = [];

    // files.find((file) =>
    //   file.name === "Collections.txt" ? importedFiles.push(file) : null
    // );

    files.find((file) =>
      file.name === "Products.txt" ? importedFiles.push(file) : null
    );

    files.find((file) =>
      file.name === "Metafield_Definitions-Collections.txt"
        ? importedFiles.push(file)
        : null
    );

    files.find((file) =>
      file.name === "Metafield_Definitions-Products.txt"
        ? importedFiles.push(file)
        : null
    );

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const file of importedFiles) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const data = e.target.result;

        if (file.name === "Metafield_Definitions-Products.txt") {
          await readProductsMetafields(data);
        } else if (file.name === "Metafield_Definitions-Collections.txt") {
          await readCollectionsMetafields(data);
        } else if (file.name === "Products.txt") {
          await readProducts(data);
        }
        // else if (file.name === "Collections.txt") {
        //   await readCollections(data);
        // }
      };

      reader.onerror = function (e) {
        console.error("Error reading file:", e);
      };

      reader.readAsText(file);
    }

    await delay(30000);

    const collections = files.find((file) => file.name === "Collections.txt");

    if (collections) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const data = e.target.result;
        await readCollections(data);
      };

      reader.onerror = function (e) {
        console.error("Error reading file:", e);
      };

      reader.readAsText(collections);
    }

    setFiles([]);
  };

  const readProductsMetafields = async (data) => {
    try {
      const parsedData = JSON.parse(data);

      const response = await fetch("/api/products/readMetafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Products Metafields uploaded successfully.", responseData);
      } else {
        console.error("Failed to upload Products Metafields: ", responseData);
      }
    } catch (error) {
      console.error("Error uploading Products Metafields: ", error);
    }
  };

  const readCollectionsMetafields = async (data) => {
    try {
      const parsedData = JSON.parse(data);

      const response = await fetch("/api/products/readMetafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log(
          "Collections Metafields uploaded successfully.",
          responseData
        );
      } else {
        console.error(
          "Failed to upload Collections Metafields: ",
          responseData
        );
      }
    } catch (error) {
      console.error("Error uploading Collections Metafields: ", error);
    }
  };

  const readProducts = async (data) => {
    try {
      const parsedData = JSON.parse(data);

      const response = await fetch("/api/readProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Products uploaded successfully.", responseData);
      } else {
        console.error("Failed to upload Products:", responseData);
      }
    } catch (error) {
      console.error("Error uploading Products:", error);
    }
  };

  const readCollections = async (data) => {
    try {
      const parsedData = JSON.parse(data);

      const response = await fetch("/api/readCollections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Collections uploaded successfully.", responseData);
      } else {
        console.error("Failed to upload Collections: ", responseData);
      }
    } catch (error) {
      console.error("Error uploading Collections: ", error);
    }
  };

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  return (
    <div>
      <DropZone
        onDrop={(files, acceptedFiles, _rejectedFiles) =>
          handleConfirmationModal(files, acceptedFiles, _rejectedFiles)
        }
      >
        {uploadedFiles}
        {fileUpload}
      </DropZone>
      <Button style={{ marginTop: "15px" }} size="large" onClick={importData}>
        Write
      </Button>
      {isOpen && (
        <ConfirmationModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          files={files}
          rejectedFiles={rejectedFiles}
          acceptedFiles={acceptedFiles}
          setFiles={setFiles}
          setAcceptedFiles={setAcceptedFiles}
          setRejectedFiles={setRejectedFiles}
          onConfirm={() => handleDropZoneDrop()}
        />
      )}
    </div>
  );
}

export default AutoDropzone;
