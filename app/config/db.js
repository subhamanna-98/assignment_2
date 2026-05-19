

require('dotenv').config()
const mongoose = require('mongoose')


const DbCon = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://subhamanna559_db_user:PPoyY8zTYTGzfOyI@cluster0.h8n6rbe.mongodb.net/EMAIL-NODE-app')
        console.log('Database connected');
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = DbCon