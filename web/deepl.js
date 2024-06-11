import axios from 'axios';

const url = 'https://api.deepl.com/v2/translate';
const authKey = '971070b2-2a37-488c-942d-36414b3c5672'; // Replace with your actual API key

const data = {
  text: ['Hello, world!'],
  target_lang: 'DE'
};

axios.post(url, data, {
  headers: {
    'Authorization': `DeepL-Auth-Key ${authKey}`,
    'User-Agent': 'YourApp/1.2.3',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
