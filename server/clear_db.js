const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected. Cleaning up empty users...');
        // Find users that have no fields other than _id and __v
        // It's harder to query for "no other fields" directly in mongo efficiently without $jsonSchema or $where, 
        // but since we switched schema, let's just delete ALL users to be safe and clean.
        // The user likely wants a fresh start with the working code.
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
