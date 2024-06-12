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
