require('dotenv').config()
const express=require('express')
const ejs=require('ejs')
const DBCon=require('./app/config/db')
const path=require('path')
const cors=require('cors')
const session=require('express-session')
const cookieParser=require('cookie-parser')


const app=express();

DBCon()

app.use(cors())
//configure ejs
app.set('view engine','ejs')
app.set('views','views')



//static folder
app.use(express.static('public'))
app.use('uploads',express.static(path.join(__dirname,'/uploads')))
app.use('/uploads',express.static('uploads')); 
//json define
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//define routes

const router=require('./app/routes') 
app.use(router)



const PORT=3000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})