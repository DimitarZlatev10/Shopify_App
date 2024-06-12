import React, { useState, useCallback } from 'react';
import { DropZone, LegacyStack, Thumbnail, Text } from '@shopify/polaris';
import { readFromFile } from '../utils/fileWriter';
import { useAuthenticatedFetch } from "../hooks";

function DropZoneExample() {
  const [files, setFiles] = useState([]);
  const fetch = useAuthenticatedFetch();

  const handleDropZoneDrop = useCallback(
    async (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
  
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
    },
    [],
  );
  

  return (
    <div>
      <DropZone onDrop={handleDropZoneDrop}>
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
                  </div>
                </LegacyStack>
              ))}
            </LegacyStack>
          </div>
        )}
        {!files.length && <DropZone.FileUpload />}
      </DropZone>
    </div>
  );
}

export default DropZoneExample;
