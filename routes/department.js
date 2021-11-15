const router = require('express').Router()
const { signup, signin } = require('../controllers/auth-department')
const { setCharges } = require('../controllers/department')
const { protectDepartmentRoute } = require('../lib/token-config')



// signup route
router.route('/signup').post(signup)

// signin route
router.route('/signin').post(signin)

// setup charges
router.route('/setup-fees').post(protectDepartmentRoute, setCharges)



module.exports = router