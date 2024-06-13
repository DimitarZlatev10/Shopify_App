import fs from 'fs'


export async function writeToFile(data, filename) {
  try {
    // Convert the data to a string (assuming it's an array or object)
    const dataString = JSON.stringify(data, null, 2);

    // Create a Blob object from the data string
    const blob = new Blob([dataString], { type: 'text/plain' });

    // Check if the browser supports the HTML5 download attribute
    if (navigator.msSaveBlob) {
      // For IE and Edge
      navigator.msSaveBlob(blob, filename);
    } else {
      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    console.log(`Data has been written to ${filename}`);
  } catch (error) {
    console.error('Error writing to file:', error);
    throw error;
  }
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




// import fs from 'fs'

// export async function writeToFile(data, filename) {
//   return new Promise((resolve, reject) => {
//     // Convert the data to a string (assuming it's an array or object)
//     const dataString = JSON.stringify(data, null, 2);

//     // Write to file
//     fs.writeFile(filename, dataString, (err) => {
//       if (err) {
//         console.error('Error writing to file:', err);
//         reject(err);
//       } else {
//         console.log(`Data has been written to ${filename}`);
//         resolve();
//       }
//     });
//   });
// }

// export async function readFromFile(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = () => {
//       try {
//         const parsedData = JSON.parse(reader.result);
//         resolve(parsedData);
//       } catch (parseErr) {
//         console.error('Error parsing JSON data:', parseErr);
//         reject(parseErr);
//       }
//     };
    
//     reader.onerror = (error) => {
//       console.error('Error reading from file:', error);
//       reject(error);
//     };
    
//     reader.readAsText(file);
//   });
// }