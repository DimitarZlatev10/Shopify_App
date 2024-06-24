import {
  LegacyCard,
  Tabs,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Button,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { NoteIcon } from "@shopify/polaris-icons";
import ConfirmationModal from "./ConfirmationModal";

const readFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = reader.result;
        resolve(content);
      } catch (error) {
        console.error("Error reading file content:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading from file:", error);
      reject(error);
    };

    reader.readAsText(file);
  });
};

function ImportTabs() {
  const [selected, setSelected] = useState(0);
  const [file, setFile] = useState();
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const fetch = useAuthenticatedFetch();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const resetValues = () => {
    setFile();
    setAcceptedFiles([]);
    setRejectedFiles([]);
    setData("");
    setIsOpen(false);
  };

  const handleDropZoneDrop = async () => {
    setFile(acceptedFiles[0]);
    if (acceptedFiles[0].type == "text/plain") {
      try {
        const fileContent = await readFromFile(acceptedFiles[0]);
        console.log(fileContent);
        setData(fileContent);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    } else {
      console.log("no works");
    }
  };

  const handleConfirmationModal = (files, acceptedFiles, _rejectedFiles) => {
    setIsOpen(true);
    setAcceptedFiles(acceptedFiles);
    setRejectedFiles(_rejectedFiles);
  };

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <LegacyStack>
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
  );

  const tabs = [
    {
      id: "Import Products Metafields",
      content: "Products Metafields",
      panelID: "Products Metafields",
    },
    {
      id: "Import Collections Metafields",
      content: "Collections Metafields",
      panelID: "Collections Metafields",
    },
    {
      id: "Import Products",
      content: "Products",
      panelID: "Products",
    },
    {
      id: "Import Collections",
      content: "Collections",
      panelID: "Collections",
    },
    {
      id: "Publish Collections and Products to Online Store",
      content: "Publish Collections and Products",
      panelID: "Publish Collections and Products",
    },
    {
      id: "Done",
      content: "Done Importing",
      panelID: "Done Importing",
    },
  ];

  const importProductsMetafields = async () => {
    console.log(file.name);
    setIsLoading(true);
    if (file.name === "Metafield_Definitions-Products.txt") {
      try {
        const response = await fetch("/api/products/readMetafields", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });
        if (response.ok) {
          setSelected(1);
          resetValues();
          setSuccessMessage("Products Metafields imported successfully!");
          setIsLoading(false);
        } else {
          console.log(response);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        "The file you imported in invalid! You must import - Metafield_Definitions-Products.txt"
      );
      setIsLoading(false);
    }
  };

  const importCollectionsMetafields = async () => {
    console.log(file.name);
    setIsLoading(true);
    if (file.name == "Metafield_Definitions-Collections.txt") {
      try {
        const response = await fetch("/api/collections/readMetafields", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });

        if (response.ok) {
          setSelected(2);
          resetValues();
          setSuccessMessage("Collections Metafields imported successfully!");
          setIsLoading(false);
        } else {
          console.error("Failed to upload file content:", response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error uploading file content:", error);
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        "The file you imported in invalid! You must import - Metafield_Definitions-Collections.txt"
      );
      setIsLoading(false);
    }
  };

  const importProducts = async () => {
    console.log(file.name);
    setIsLoading(true);
    if (
      file.name == "Products.txt" ||
      file.name == "Products-English.txt" ||
      file.name == "Products-Slovenian.txt"
    ) {
      try {
        const response = await fetch("/api/readProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });

        if (response.ok) {
          setSelected(3);
          resetValues();
          setSuccessMessage("Products imported successfully!");
          setIsLoading(false);
        } else {
          console.error("Failed to upload file content:", response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error uploading file content:", error);
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        "The file you imported in invalid! You must import - Products.txt"
      );
      setIsLoading(false);
    }
  };

  const importCollections = async () => {
    console.log(file.name);
    setIsLoading(true);
    if (file.name === "Collections.txt") {
      try {
        const response = await fetch("/api/readCollections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });

        if (response.ok) {
          setSelected(4);
          resetValues();
          setSuccessMessage("Collections imported successfully!");
          setIsLoading(false);
        } else {
          console.error("Failed to upload file content:", response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error uploading file content:", error);
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        "The file you imported in invalid! You must import - Collections.txt"
      );
      setIsLoading(false);
    }
  };

  const PublishCollectionsAndProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/publishCollectionsAndProducts", {
        method: "POST",
      });

      if (response.ok) {
        setSelected(5);
        setSuccessMessage("Published Collections and Products successfully!");
        setIsLoading(false);
      } else {
        console.error("Failed to publish Collections and Products:", response);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error publishing Collections and Products:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Import Shop Contents</h1>
      </div>
      <hr style={{ marginTop: "15px", textDecoration: "underline" }} />
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section title={tabs[selected].content}>
          {errorMessage && (
            <div
              style={{
                color: "red",
                marginTop: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div
              style={{
                color: "green",
                marginTop: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {successMessage}
            </div>
          )}
          {selected === 0 && (
            <div>
              <DropZone
                allowMultiple={false}
                label="Import Products Metafields"
                onDrop={handleConfirmationModal}
              >
                {uploadedFile}
                {fileUpload}
              </DropZone>
              <br />
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={importProductsMetafields}
              >
                Import Products Metafields
              </Button>
              {isOpen && (
                <ConfirmationModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  file={file}
                  rejectedFiles={rejectedFiles}
                  acceptedFiles={acceptedFiles}
                  setFile={setFile}
                  data={data}
                  setAcceptedFiles={setAcceptedFiles}
                  setRejectedFiles={setRejectedFiles}
                  onConfirm={() => handleDropZoneDrop()}
                />
              )}
            </div>
          )}
          {selected === 1 && (
            <div>
              <DropZone
                allowMultiple={false}
                label="Import Collections Metafields"
                onDrop={handleConfirmationModal}
              >
                {uploadedFile}
                {fileUpload}
              </DropZone>
              <br />
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={importCollectionsMetafields}
              >
                Import Collections Metafields
              </Button>
              {isOpen && (
                <ConfirmationModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  file={file}
                  rejectedFiles={rejectedFiles}
                  acceptedFiles={acceptedFiles}
                  setFile={setFile}
                  data={data}
                  setAcceptedFiles={setAcceptedFiles}
                  setRejectedFiles={setRejectedFiles}
                  onConfirm={() => handleDropZoneDrop()}
                />
              )}
            </div>
          )}
          {selected === 2 && (
            <div>
              <DropZone
                allowMultiple={false}
                label="Import Products"
                onDrop={handleConfirmationModal}
              >
                {uploadedFile}
                {fileUpload}
              </DropZone>
              <br />
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={importProducts}
              >
                Import Products
              </Button>
              {isOpen && (
                <ConfirmationModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  file={file}
                  rejectedFiles={rejectedFiles}
                  acceptedFiles={acceptedFiles}
                  setFile={setFile}
                  data={data}
                  setAcceptedFiles={setAcceptedFiles}
                  setRejectedFiles={setRejectedFiles}
                  onConfirm={() => handleDropZoneDrop()}
                />
              )}
            </div>
          )}
          {selected === 3 && (
            <div>
              <DropZone
                allowMultiple={false}
                label="Import Collections"
                onDrop={handleConfirmationModal}
              >
                {uploadedFile}
                {fileUpload}
              </DropZone>
              <br />
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={importCollections}
              >
                Import Collections
              </Button>
              {isOpen && (
                <ConfirmationModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  file={file}
                  rejectedFiles={rejectedFiles}
                  acceptedFiles={acceptedFiles}
                  setFile={setFile}
                  data={data}
                  setAcceptedFiles={setAcceptedFiles}
                  setRejectedFiles={setRejectedFiles}
                  onConfirm={() => handleDropZoneDrop()}
                />
              )}
            </div>
          )}
          {selected === 4 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={PublishCollectionsAndProducts}
              >
                Publish Collections And Products
              </Button>
            </div>
          )}
        </LegacyCard.Section>
      </Tabs>
    </div>
  );
}

export default ImportTabs;
