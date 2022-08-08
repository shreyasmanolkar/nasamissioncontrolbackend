require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL_WHITELIST_KEY;


mongoose.connection.once('open', ()=>{
    console.log('MongoDB connected!!!');
});

mongoose.connection.on('error', (err)=>{
    console.error(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
};

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
} 


