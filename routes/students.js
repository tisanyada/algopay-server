const router = require('express').Router()
const { signup, signin } = require('../controllers/auth-student')
const { create_updateProfile, addProfileImage, getProfile, paySchoolCharges, payFacultyCharges, payDepartmentCharges, getSchoolChargesReceipt, getFacultyChargesReceipt, getDepartmentChargesReceipt, getAlgoBalance, getSchoolPaymentInfo, getFacultyPaymentInfo, getDepartmentPaymentInfo } = require('../controllers/student')
const { protectStudentRoute } = require('../lib/token-config')



// signup route
router.route('/signup').post(signup)

// signin route
router.route('/signin').post(signin)

// create profile route
router.route('/create-profile').post(protectStudentRoute, create_updateProfile)

// add profile image route
router.route('/attach-photo').post(protectStudentRoute, addProfileImage)

// get profile route
router.route('/get-profile').get(protectStudentRoute, getProfile)

// get algo balance
router.route('/get-algobalance').get(protectStudentRoute, getAlgoBalance)

// make payment school
router.route('/payments/school-info').get(protectStudentRoute, getSchoolPaymentInfo)
router.route('/payments/school').post(protectStudentRoute, paySchoolCharges)

// make payment faculty
router.route('/payments/faculty-info').get(protectStudentRoute, getFacultyPaymentInfo)
router.route('/payments/faculty').post(protectStudentRoute, payFacultyCharges)

// make payment department
router.route('/payments/department-info').get(protectStudentRoute, getDepartmentPaymentInfo)
router.route('/payments/department').post(protectStudentRoute, payDepartmentCharges)


// get receipts 
router.route('/receipts/school').get(protectStudentRoute, getSchoolChargesReceipt)

router.route('/receipts/faculty').get(protectStudentRoute, getFacultyChargesReceipt)

router.route('/receipts/department').get(protectStudentRoute, getDepartmentChargesReceipt)


module.exports = router