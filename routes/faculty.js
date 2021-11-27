const router = require('express').Router()
const { signup, signin } = require('../controllers/auth-faculty')
const {
    setCharges, getUnverifiedSchoolReceipts,
    getVerifiedSchoolReceipts, getUnverifiedFacultyReceipts,
    getVerifiedFacultyReceipts
} = require('../controllers/faculty')
const { getReceipt, verifyReceipt } = require('../controllers')
const { protectFacultyRoute } = require('../lib/token-config')



// signup route
router.route('/signup').post(signup)

// signin route
router.route('/signin').post(signin)

// setup charges
router.route('/setup-fees').post(protectFacultyRoute, setCharges)

// get school receipts
router.route('/receipts/school-unverified/:facultyId').get(protectFacultyRoute, getUnverifiedSchoolReceipts)
router.route('/receipts/school-verified/:facultyId').get(protectFacultyRoute, getVerifiedSchoolReceipts)

router.route('/receipts/:receiptId').get(protectFacultyRoute, getReceipt)

router.route('/receipts/verify/:receiptId').put(protectFacultyRoute, verifyReceipt)


router.route('/receipts/faculty-unverified/:facultyId').get(protectFacultyRoute, getUnverifiedFacultyReceipts)
router.route('/receipts/faculty-verified/:facultyId').get(protectFacultyRoute, getVerifiedFacultyReceipts)



module.exports = router