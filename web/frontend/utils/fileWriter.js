import fs from 'fs'

export async function writeToFile(data, filename) {
  return new Promise((resolve, reject) => {
    // Convert the data to a string (assuming it's an array or object)
    const dataString = JSON.stringify(data, null, 2);

    // Write to file
    fs.writeFile(filename, dataString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        reject(err);
      } else {
        console.log(`Data has been written to ${filename}`);
        resolve();
      }
    });
  });
}

export async function readFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const parsedData = JSON.parse(reader.result);
        resolve(parsedData);
      } catch (parseErr) {
        console.error('Error parsing JSON data:', parseErr);
        reject(parseErr);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading from file:', error);
      reject(error);
    };
    
    reader.readAsText(file);
  });
}
