


const express=require('express')

const router=express.Router()


const AuthEmailROuter = require('./AuthEmailROuter')

const ProtectedRouter = require('./ProtedtedRouter')

router.use('/api',AuthEmailROuter)
router.use('/api',ProtectedRouter)


module.exports=router