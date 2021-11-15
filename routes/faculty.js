const router = require('express').Router()
const { signup, signin } = require('../controllers/auth-faculty')
const { setCharges } = require('../controllers/faculty')
const { protectFacultyRoute } = require('../lib/token-config')



// signup route
router.route('/signup').post(signup)

// signin route
router.route('/signin').post(signin)

// setup charges
router.route('/setup-fees').post(protectFacultyRoute, setCharges)



module.exports = router