const algoSdk = require('algosdk')
const { issueStudentJwt } = require("../lib/token-config")
const Student = require("../models/Student")


// validations
const validateSignup = require("../validations/student-signup")
const validateSignin = require("../validations/student-signin")


exports.signup = async (req, res) => {
    try {
        const { errors, isValid } = validateSignup(req.body)
        const { schoolMail, mnemonicKey, algoAddress, password, confirm_password } = req.body
        
        if (!isValid) return res.status(400).json(errors)

        const isStudent = await Student.findOne({ schoolMail })
        const address = algoSdk.mnemonicToSecretKey(mnemonicKey)
        const isAlgoAddress = await Student.findOne({ algoAddress })
        if (isStudent) {
            errors.schoolMail = "student already exists with this mail"
            return res.status(400).json(errors)
        }
        if (isAlgoAddress) {
            errors.algoAddress = "student already exists with this algo address"
            return res.status(400).json(errors)
        }

        const student = await Student.create({ schoolMail, algoAddress, password, confirm_password })
        if (student) return res.json({
            _id: student._id,
            schoolMail: student.schoolMail,
            algoAddress: student.algoAddress,
            mnemonicKey: mnemonicKey,
            token: issueStudentJwt(student)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}

exports.signin = async (req, res) => {
    try {
        const { errors, isValid } = validateSignin(req.body)
        const { mnemonicKey, schoolMail, password } = req.body

        if (!isValid) return res.status(400).json(errors)

        const student = await Student.findOne({ schoolMail })
        const address = algoSdk.mnemonicToSecretKey(mnemonicKey)
        const isAlgoAddress = await Student.findOne({ algoAddress: address.addr })

        if (!student) {
            errors.schoolMail = "student does not exist with this mail"
            return res.status(400).json(errors)
        }
        if (!isAlgoAddress) {
            errors.mnemonicKey = "incorrect mnemonic key"
            return res.status(400).json(errors)
        }

        const isMatch = await student.comparePassword(password)
        if (!isMatch) {
            errors.password = "incorrect password"
            return res.status(400).json(errors)
        }

        return res.json({
            _id: student._id,
            schoolMail: student.schoolMail,
            algoAddress: student.algoAddress,
            mnemonicKey: mnemonicKey,
            token: issueStudentJwt(student)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}