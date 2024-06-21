import React, { useState } from "react";
import { DropZone, LegacyStack, Text, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import ConfirmationModal from "./ConfirmationModal";
import { useTranslation } from "react-i18next";

// Utility function to read file content
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

function Dropzone() {
  const emptyToastProps = { content: null };
  const [files, setFiles] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [toastProps, setToastProps] = useState({
    content: null,
    error: false,
  });
  const [step, setStep] = useState(1);
  const fetch = useAuthenticatedFetch();

  const handleConfirmationModal = (files, acceptedFiles, _rejectedFiles) => {
    setIsOpen(true);
    setAcceptedFiles(acceptedFiles);
    setRejectedFiles(_rejectedFiles);
  };

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const resetValues = () => {
    setFiles([]);
    setAcceptedFiles([]);
    setRejectedFiles([]);
    setContent("");
    setIsOpen(false);
  };

  const handleDropZoneDrop = async () => {
    setFiles((files) => [...files, ...acceptedFiles]);
    for (const file of acceptedFiles) {
      // Check if the uploaded file is a text file
      if (file.type === "text/plain") {
        try {
          // Read the file content
          const fileContent = await readFromFile(file);
          setContent(fileContent);
          setToastProps({
            content: t("Dropzone.successReadMessage"),
            error: false,
          });
        } catch (error) {
          console.error("Error reading file:", error);
          setToastProps({
            content: t("Dropzone.errorReadMessage"),
            error: true,
          });
        }
      } else {
        setToastProps({
          content: t("Dropzone.unsupportedFileTypeMessage"),
          error: true,
        });
      }
    }
  };

  const readProductsMetafields = async () => {
    try {
      for (const file of acceptedFiles) {
        // Check if the uploaded file is a text file
        if (file.type === "text/plain") {
          try {
            // Send the file content to the server
            const response = await fetch("/api/products/readMetafields", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            });

            if (response.ok) {
              console.log("File content uploaded successfully.");
              setToastProps({
                content: t("Dropzone.successWriteMessage"),
                error: false,
              });
            } else {
              console.error(
                "Failed to upload file content:",
                response.statusText
              );
              setToastProps({
                content: t("Dropzone.errorUploadMessage"),
                error: true,
              });
            }
          } catch (error) {
            console.error("Error uploading file content:", error);
            setToastProps({
              content: t("Dropzone.errorUploadMessage"),
              error: true,
            });
          }
        } else {
          console.error("Uploaded file is not a text file.");
          setToastProps({
            content: t("Dropzone.unsupportedFileTypeMessage"),
            error: true,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    resetValues();
    setStep(2);
  };

  const readCollectionsMetafields = async () => {
    try {
      for (const file of acceptedFiles) {
        // Check if the uploaded file is a text file
        if (file.type === "text/plain") {
          try {
            // Send the file content to the server
            const response = await fetch("/api/collections/readMetafields", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            });

            if (response.ok) {
              console.log("File content uploaded successfully.");
              setToastProps({
                content: t("Dropzone.successWriteMessage"),
                error: false,
              });
            } else {
              console.error(
                "Failed to upload file content:",
                response.statusText
              );
              setToastProps({
                content: t("Dropzone.errorUploadMessage"),
                error: true,
              });
            }
          } catch (error) {
            console.error("Error uploading file content:", error);
            setToastProps({
              content: t("Dropzone.errorUploadMessage"),
              error: true,
            });
          }
        } else {
          console.error("Uploaded file is not a text file.");
          setToastProps({
            content: t("Dropzone.unsupportedFileTypeMessage"),
            error: true,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    resetValues();
    setStep(3);
  };

  const readProducts = async () => {
    try {
      for (const file of acceptedFiles) {
        // Check if the uploaded file is a text file
        if (file.type === "text/plain") {
          try {
            // Send the file content to the server
            const response = await fetch("/api/readProducts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            });

            if (response.ok) {
              console.log("File content uploaded successfully.");
              setToastProps({
                content: t("Dropzone.successWriteMessage"),
                error: false,
              });
            } else {
              console.error(
                "Failed to upload file content:",
                response.statusText
              );
              setToastProps({
                content: t("Dropzone.errorUploadMessage"),
                error: true,
              });
            }
          } catch (error) {
            console.error("Error uploading file content:", error);
            setToastProps({
              content: t("Dropzone.errorUploadMessage"),
              error: true,
            });
          }
        } else {
          console.error("Uploaded file is not a text file.");
          setToastProps({
            content: t("Dropzone.unsupportedFileTypeMessage"),
            error: true,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    resetValues();
    setStep(4);
  };

  const readCollections = async () => {
    try {
      for (const file of acceptedFiles) {
        // Check if the uploaded file is a text file
        if (file.type === "text/plain") {
          try {
            // Send the file content to the server
            const response = await fetch("/api/readCollections", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            });

            if (response.ok) {
              console.log("File content uploaded successfully.");
              setToastProps({
                content: t("Dropzone.successWriteMessage"),
                error: false,
              });
            } else {
              console.error(
                "Failed to upload file content:",
                response.statusText
              );
              setToastProps({
                content: t("Dropzone.errorUploadMessage"),
                error: true,
              });
            }
          } catch (error) {
            console.error("Error uploading file content:", error);
            setToastProps({
              content: t("Dropzone.errorUploadMessage"),
              error: true,
            });
          }
        } else {
          console.error("Uploaded file is not a text file.");
          setToastProps({
            content: t("Dropzone.unsupportedFileTypeMessage"),
            error: true,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    resetValues();
    setStep(5);
  };

  if (step == 1) {
    return (
      <div>
        <p>Step 1 - Create Products Metafields</p>
        {toastMarkup}
        <div style={{ marginTop: "15px" }}></div>
        <DropZone
          onDrop={(files, acceptedFiles, _rejectedFiles) =>
            handleConfirmationModal(files, acceptedFiles, _rejectedFiles)
          }
        >
          {files.length > 0 && (
            <div style={{ padding: "0" }}>
              <LegacyStack vertical>
                {files.map((file, index) => (
                  <LegacyStack alignment="center" key={index}>
                    <div>
                      {file.name}{" "}
                      <Text variant="bodySm" as="p">
                        {file.size} bytes
                      </Text>
                      <div style={{ marginTop: "15px" }}>
                        <pre>{content}</pre>
                      </div>
                    </div>
                  </LegacyStack>
                ))}
              </LegacyStack>
            </div>
          )}
          {!files.length && <DropZone.FileUpload />}
        </DropZone>
        <br />
        <Button
          style={{ marginTop: "15px" }}
          size="large"
          onClick={readProductsMetafields}
        >
          Write
        </Button>
        {isOpen && (
          <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            content={content}
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
  } else if (step == 2) {
    return (
      <div>
        <p>Step 2 - Create Collections Metafields</p>
        {toastMarkup}
        <div style={{ marginTop: "15px" }}></div>
        <DropZone
          onDrop={(files, acceptedFiles, _rejectedFiles) =>
            handleConfirmationModal(files, acceptedFiles, _rejectedFiles)
          }
        >
          {files.length > 0 && (
            <div style={{ padding: "0" }}>
              <LegacyStack vertical>
                {files.map((file, index) => (
                  <LegacyStack alignment="center" key={index}>
                    <div>
                      {file.name}{" "}
                      <Text variant="bodySm" as="p">
                        {file.size} bytes
                      </Text>
                      <div style={{ marginTop: "15px" }}>
                        <pre>{content}</pre>
                      </div>
                    </div>
                  </LegacyStack>
                ))}
              </LegacyStack>
            </div>
          )}
          {!files.length && <DropZone.FileUpload />}
        </DropZone>
        <br />
        <Button
          style={{ marginTop: "15px" }}
          size="large"
          onClick={readCollectionsMetafields}
        >
          Write
        </Button>
        {isOpen && (
          <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            content={content}
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
  } else if (step == 3) {
    return (
      <div>
        <p>Step 3 - Create Products</p>
        {toastMarkup}
        <div style={{ marginTop: "15px" }}></div>
        <DropZone
          onDrop={(files, acceptedFiles, _rejectedFiles) =>
            handleConfirmationModal(files, acceptedFiles, _rejectedFiles)
          }
        >
          {files.length > 0 && (
            <div style={{ padding: "0" }}>
              <LegacyStack vertical>
                {files.map((file, index) => (
                  <LegacyStack alignment="center" key={index}>
                    <div>
                      {file.name}{" "}
                      <Text variant="bodySm" as="p">
                        {file.size} bytes
                      </Text>
                      <div style={{ marginTop: "15px" }}>
                        <pre>{content}</pre>
                      </div>
                    </div>
                  </LegacyStack>
                ))}
              </LegacyStack>
            </div>
          )}
          {!files.length && <DropZone.FileUpload />}
        </DropZone>
        <br />
        <Button
          style={{ marginTop: "15px" }}
          size="large"
          onClick={readProducts}
        >
          Write
        </Button>
        {isOpen && (
          <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            content={content}
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
  } else if (step == 4) {
    return (
      <div>
        <p>Step 4 - Create Collections</p>
        {toastMarkup}
        <div style={{ marginTop: "15px" }}></div>
        <DropZone
          onDrop={(files, acceptedFiles, _rejectedFiles) =>
            handleConfirmationModal(files, acceptedFiles, _rejectedFiles)
          }
        >
          {files.length > 0 && (
            <div style={{ padding: "0" }}>
              <LegacyStack vertical>
                {files.map((file, index) => (
                  <LegacyStack alignment="center" key={index}>
                    <div>
                      {file.name}{" "}
                      <Text variant="bodySm" as="p">
                        {file.size} bytes
                      </Text>
                      <div style={{ marginTop: "15px" }}>
                        <pre>{content}</pre>
                      </div>
                    </div>
                  </LegacyStack>
                ))}
              </LegacyStack>
            </div>
          )}
          {!files.length && <DropZone.FileUpload />}
        </DropZone>
        <br />
        <Button
          style={{ marginTop: "15px" }}
          size="large"
          onClick={readCollections}
        >
          Write
        </Button>
        {isOpen && (
          <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            content={content}
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
  } else if (step == 5) {
    return (
      <div>
        <p>
          Congrats you are done! Successfully created Products Metafields,
          Collections Metafields, Products, Collections!
        </p>
      </div>
    );
  }
}

export default Dropzone;
