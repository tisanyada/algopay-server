const router = require('express').Router()
const { signup, signin } = require('../controllers/auth-department')
const { setCharges, getUnverifiedDepartmentReceipts, getVerifiedDepartmentReceipts, getVerifiedSchoolReceipts } = require('../controllers/department')
const { getReceipt, verifyReceipt } = require('../controllers')
const { protectDepartmentRoute } = require('../lib/token-config')



// signup route
router.route('/signup').post(signup)

// signin route
router.route('/signin').post(signin)

// setup charges
router.route('/setup-fees').post(protectDepartmentRoute, setCharges)

// get school receipts
router.route('/receipts/school/:facultyId/:department').get(protectDepartmentRoute, getVerifiedSchoolReceipts)
router.route('/receipts/department-unverified/:departmentId').get(protectDepartmentRoute, getUnverifiedDepartmentReceipts)
router.route('/receipts/department-verified/:departmentId').get(protectDepartmentRoute, getVerifiedDepartmentReceipts)

router.route('/receipts/:receiptId').get(protectDepartmentRoute, getReceipt)

router.route('/receipts/verify/:receiptId').put(protectDepartmentRoute, verifyReceipt)


module.exports = router