const axios = require('axios');

async function inspectUsers() {
    try {
        // Fetch page 1
        console.log('--- Page 1 ---');
        const res1 = await axios.get('https://assessment-readcsvfile.vercel.app/users?page=1&limit=10');
        res1.data.users.forEach((u, i) => {
            console.log(`[${i}] Keys:`, Object.keys(u).filter(k => k !== '_id' && k !== '__v'));
            console.log(`    Data:`, JSON.stringify(u));
        });

        // Fetch page 2
        console.log('\n--- Page 2 ---');
        const res2 = await axios.get('https://assessment-readcsvfile.vercel.app/users?page=2&limit=10');
        res2.data.users.forEach((u, i) => {
            console.log(`[${i + 10}] Keys:`, Object.keys(u).filter(k => k !== '_id' && k !== '__v'));
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectUsers();
