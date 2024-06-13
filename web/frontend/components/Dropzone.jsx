import React, { useState, useCallback } from 'react';
import { DropZone, LegacyStack, Thumbnail, Text, Button } from '@shopify/polaris';
import { Toast } from "@shopify/app-bridge-react";
import { readFromFile, writeToFile } from '../utils/fileWriter';
import { useAuthenticatedFetch } from "../hooks";
import ConfirmationModal from './ConfirmationModal';
import { useTranslation } from 'react-i18next';

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
  const fetch = useAuthenticatedFetch();
  
  const handleConfirmationModal = (files, acceptedFiles, _rejectedFiles) => {
    setIsOpen(true);
    setAcceptedFiles(acceptedFiles);
    setRejectedFiles(_rejectedFiles);
  };

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleDropZoneDrop = async () => {
    setFiles((files) => [...files, ...acceptedFiles]);
    for (const file of acceptedFiles) {
    // Check if the uploaded file is a text file
      if (file.type === 'text/plain') {
        try {
          // Read the file content
        const fileContent = await readFromFile(file);
        setContent(fileContent);
        setToastProps({
          content: t("Dropzone.successReadMessage"),
          error: false,
        });
        } catch (error) {
          console.error('Error reading file:', error);
          // Handle error reading file
        }
      }
    }
  }

  const handleWrite = async () => {
    try {
      for (const file of acceptedFiles) {
        // Check if the uploaded file is a text file
        if (file.type === 'text/plain') {
          try {
            // Read the file content
            const fileContent = await readFromFile(file);
  
            // Send the file content to the server
            const response = await fetch('/api/products/readMetafields', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: fileContent }),
            });
  
            if (response.ok) {
              console.log('File content uploaded successfully.');
              // Do something after successful upload if needed
            } else {
              console.error('Failed to upload file content:', response.statusText);
              // Handle failed upload
            }
          } catch (error) {
            console.error('Error reading file:', error);
            // Handle error reading file
          }
        } else {
          console.error('Uploaded file is not a text file.');
          // Handle error for unsupported file type
        }
      }
    } catch(error) {
      console.error('error', error);
    }
  }
  
  return (
    <div>
      {toastMarkup}
      <div style={{marginTop: "15px"}} ></div>
      <DropZone onDrop={(files, acceptedFiles, _rejectedFiles) => handleConfirmationModal(files, acceptedFiles, _rejectedFiles)}>
        {files.length > 0 && (
          <div style={{ padding: '0' }}>
            <LegacyStack vertical>
              {files.map((file, index) => (
                <LegacyStack alignment="center" key={index}>
                  {/* <Thumbnail
                    size="small"
                    alt={file.name}
                    source={window.URL.createObjectURL(file)}
                  /> */}
                  <div>
                    {file.name}{' '}
                    <Text variant="bodySm" as="p">
                      {file.size} bytes
                    </Text>
                    <div style={{marginTop: "15px"}}><pre>{JSON.stringify(content ?? fileContent, null, 2) }</pre></div>
                  </div>
                </LegacyStack>
              ))}
            </LegacyStack>
          </div>
        )}
        {!files.length && <DropZone.FileUpload />}
      </DropZone>
      <br/>
      <Button  size="large" onClick={handleWrite}>Write</Button>
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
}

export default Dropzone;
