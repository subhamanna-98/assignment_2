

const express=require('express')
const AuthSubEmailController = require('../controller/AuthSubEmailController')

const router=express.Router()


router.post('/register', AuthSubEmailController.register )
router.post('/verify', AuthSubEmailController.verify )
router.post('/login',AuthSubEmailController.login )

module.exports = router