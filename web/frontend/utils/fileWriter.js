import fs from 'fs'
import os from 'os'

export async function writeToFile(data, filename) {

  const homeDirectory = os.homedir()

  const filePath = `${homeDirectory}/${filename}`;

  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data, null, 2);

    fs.writeFile(filePath, dataString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        reject(err);
      } else {
        console.log(`Data has been written to ${filePath}`);
        resolve();
      }
    });
  });
}

export async function readFromFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading from file:', err);
        reject(err);
      } else {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (parseErr) {
          console.error('Error parsing JSON data:', parseErr);
          reject(parseErr);
        }
      }
    });
  });
}
