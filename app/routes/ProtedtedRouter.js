

const express=require('express')

const Auth = require('../middlewire/AuthEmailMiddlewire')
const role = require('../middlewire/RoleMiddlewire')
const ProtectedController = require('../controller/ProtectedController')
const router=express.Router()

router.get('/user-dashboard',Auth,role('user','admin'),ProtectedController.userDashboard)
router.get('/admin-dashboard',Auth,role('admin'),ProtectedController.adminDashboard)
router.get('/profile',Auth,ProtectedController.profile)


module.exports = router