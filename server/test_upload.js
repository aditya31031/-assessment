const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    const form = new FormData();
    const filePath = path.join('c:/Users/adity/Desktop/assesment/client/dynamic_test.csv');
    form.append('file', fs.createReadStream(filePath));

    try {
        console.log('Uploading file...');
        const res = await axios.post('https://assessment-5xpn.onrender.com/import', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Upload Status:', res.status);
        console.log('Upload Response:', res.data);

        // Now fetch users
        const getRes = await axios.get('https://assessment-5xpn.onrender.com/users');
        console.log('Users found:', getRes.data.users.length);
        if (getRes.data.users.length > 0) {
            console.log('Last User Keys:', Object.keys(getRes.data.users[getRes.data.users.length - 1]));
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testUpload();
