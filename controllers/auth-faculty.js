const algosdk = require('algosdk')
const Faculty = require('../models/Faculty')
const { issueFacultyJwt } = require('../lib/token-config')


const validateSignup = require('../validations/faculty-signup')
const validateSignin = require('../validations/faculty-signin')


exports.signup = async (req, res) => {
    try {
        const { errors, isValid } = validateSignup(req.body)
        const { personnelID, facultyID, facultyName, personnelMail, fullName, algoAddress, password } = req.body

        if (!isValid) return res.status(400).json(errors)

        const isPersonnel = await Faculty.findOne({ 'personnelID': personnelID })
        if (isPersonnel) {
            errors.personnelID = 'personnelID is already registered'
            return res.status(400).json(errors)
        }

        const personnel = await Faculty.create({
            personnelID,
            facultyID,
            facultyName,
            personnelMail,
            fullName,
            algoAddress,
            password
        })
        if (personnel) return res.json({
            _id: personnel._id,
            personnelID,
            facultyID,
            facultyName,
            personnelMail,
            fullName,
            algoAddress,
            token: issueFacultyJwt(personnel)
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

        const personnel = await Faculty.findOne({ 'personnelMail': personnelMail })
        const address = algosdk.mnemonicToSecretKey(mnemonicKey)
        const isAlgoAddress = await Faculty.findOne({ algoAddress: address.addr })

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
            facultyID: personnel.facultyID,
            facultyName: personnel.facultyName,
            personnelMail: personnel.personnelMail,
            fullName: personnel.fullName,
            algoAddress: personnel.algoAddress,
            token: issueFacultyJwt(personnel)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}