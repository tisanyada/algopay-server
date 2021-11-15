const algosdk = require('algosdk')
const Department = require('../models/Department')
const { issueDepartmentJwt } = require('../lib/token-config')


const validateSignup = require('../validations/dept-signup')
const validateSignin = require('../validations/dept-signin')


exports.signup = async (req, res) => {
    try {
        const { errors, isValid } = validateSignup(req.body)
        const { personnelID, facultyName, departmentID, departmentName, personnelMail, fullName, algoAddress, password } = req.body

        if (!isValid) return res.status(400).json(errors)

        const isPersonnel = await Department.findOne({ 'personnelID': personnelID })
        if (isPersonnel) {
            errors.personnelID = 'personnelID is already registered'
            return res.status(400).json(errors)
        }

        const personnel = await Department.create({
            personnelID,
            facultyName,
            departmentID,
            departmentName,
            personnelMail,
            fullName,
            algoAddress,
            password
        })
        if (personnel) return res.json({
            _id: personnel._id,
            personnelID,
            facultyName,
            departmentID,
            departmentName,
            personnelMail,
            fullName,
            algoAddress,
            token: issueDepartmentJwt(personnel)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.signin = async (req, res) => {
    try {
        const { errors, isValid } = validateSignin(req.body)
        const { personnelMail, mnemonicKey, password } = req.body

        if (!isValid) return res.status(400).json(errors)

        const personnel = await Department.findOne({ 'personnelMail': personnelMail })
        const address = algosdk.mnemonicToSecretKey(mnemonicKey)
        const isAlgoAddress = await Department.findOne({ algoAddress: address.addr })

        if (!personnel) {
            errors.personnelID = 'personnelID is not registered'
            return res.status(400).json(errors)
        }
        if (!isAlgoAddress) {
            errors.mnemonicKey = 'incorrect mnemonic key'
            return res.status(400).json(errors)
        }

        const isMatch = await personnel.comparePassword(password)
        if (!isMatch) {
            errors.password = "incorrect password"
            return res.status(400).json(errors)
        }


        return res.json({
            _id: personnel._id,
            personnelID: personnel.personnelID,
            facultyName: personnel.facultyName,
            departmentID: personnel.departmentID,
            departmentName: personnel.departmentName,
            personnelMail: personnel.personnelMail,
            fullName: personnel.fullName,
            algoAddress: personnel.algoAddress,
            token: issueDepartmentJwt(personnel)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}