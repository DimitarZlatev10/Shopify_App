import axios from 'axios';

const url = 'https://api.deepl.com/v2/translate';
const authKey = '8c1e0923-30de-457d-a753-787850910054'; // Replace with your actual API key

const data = {
  text: ['Hello, world!'],
  target_lang: 'DE'
};

axios.post(url, data, {
  headers: {
    'Authorization': `DeepL-Auth-Key ${authKey}`,
    'User-Agent': 'bb@vitaoncompany.com',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
