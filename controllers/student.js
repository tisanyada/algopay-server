require('dotenv').config()
const algosdk = require('algosdk')
const axios = require('axios')
const Student = require("../models/Student")
const StudentProfile = require("../models/StudentProfile")
const Payment = require('../models/Payment')
const Fee = require('../models/Fee')
const upload = require("../lib/upload-config")
const cloudinary = require('../lib/cloudinary')
const algoClient = require('../config/algoclient')


// validations
const validateProfile = require('../validations/student-profile')
const validatePassport = require('../validations/passport-upload')
const validatePayment = require('../validations/payment')


exports.create_updateProfile = async (req, res) => {
    try {
        const { errors, isValid } = validateProfile(req.body)
        const { fullName, schoolMail, algoAddress, matriculationNumber, faculty, department, level, phoneNumber } = req.body

        if (!isValid) return res.status(400).json(errors)
        const profileFields = {
            student: req.user._id,
            fullName,
            schoolMail,
            algoAddress,
            matriculationNumber,
            faculty,
            department,
            level,
            phoneNumber,
            passport: 'https://res.cloudinary.com/tisanyada/image/upload/v1636220912/xgyoyk7nwmnz7qoxmv0g.png'
        }

        const isProfile = await StudentProfile.findOne({ 'student': req.user.id })

        if (isProfile) {
            // update profile
            const profile = await StudentProfile.findOneAndUpdate({ 'student': req.user.id }, { $set: profileFields }, { new: true, useFindAndModify: false })
            return res.json(profile)
        } else {
            // create profile
            const profile = await StudentProfile.create(profileFields)
            return res.json(profile)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.addProfileImage = async (req, res) => {
    try {
        return upload(req, res, async (error) => {
            if (error && error.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'file size must be less than 1MB' })

            if (!req.file) return res.status(400).json({ message: 'please upload a passport photograph' })

            if (!validatePassport(req.file)) return res.status(400).json({ message: 'please upload a valid passport photograph jpg|jpeg|png' })

            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            const isProfile = await StudentProfile.findOne({ 'student': req.user.id })

            if (isProfile) {
                // update profile
                const imageField = {
                    passport: secure_url
                }

                const profile = await StudentProfile.findOneAndUpdate({ 'student': req.user.id }, { $set: imageField }, { new: true, useFindAndModify: false })
                return res.json(profile)
            } else {
                return res.status(500).json({ message: 'an error occured while uploading image' })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ 'student': req.user.id })
        return res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getAlgoBalance = async (req, res) => {
    try {
        const studentProfile = await StudentProfile.findOne({ 'student': req.user.id })
        const { amount } = await algoClient.accountInformation(studentProfile.algoAddress).do()
        return res.json({
            balance: amount/1000000
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.paySchoolCharges = async (req, res) => {
    try {
        const { errors, isValid } = validatePayment(req.body)
        const { paymentType, mnemonicKey } = req.body

        if (!isValid) return res.status(400).json(errors)
        const student = await Student.findById(req.user.id)
        const studentProfile = await StudentProfile.findOne({ 'student': req.user.id })
        const fee = await Fee.findOne({ 'paymentType': paymentType })
        const algoSecret = algosdk.mnemonicToSecretKey(mnemonicKey).sk
        const { data: { rate } } = await axios.get("https://rest.coinapi.io/v1/exchangerate/USD/NGN", { headers: { 'X-CoinAPI-Key': process.env.COINAPI_KEY } })
        const algoRate = parseInt(rate.toFixed(2))
        const schoolRate = parseInt(fee.paymentAmount)
        const totalAmount = Math.round(schoolRate / algoRate)
        // console.log(totalAmount)
        // console.log(totalAmount * algoRate)
        const accountInfo = await algoClient.accountInformation(student.algoAddress).do()

        if (accountInfo.amount < totalAmount) return res.status(400).json({ message: 'insufficient balance' })

        // const mn = "shoulder bid nice taxi oven twice wheel exercise ramp hotel together drama gauge parent option powder anchor unlock cement frost toilet identify limb ability divide"
        // const sk = algosdk.mnemonicToSecretKey(mn)

        const params = await algoClient.getTransactionParams().do()
        const signedTXN = algosdk.signTransaction({
            from: student.algoAddress,
            to: fee.paymentAddress,
            fee: 100,
            amount: 1000000,
            firstRound: params.firstRound,
            lastRound: params.lastRound,
            genesisID: params.genesisID,
            genesisHash: params.genesisHash,
            note: new Uint8Array(0)
        }, algoSecret)
        const sentTRX = await algoClient.sendRawTransaction(signedTXN.blob).do()
        if (sentTRX) {
            const paymentFields = {
                student: req.user.id,
                paymentId: sentTRX.txId,
                amount: totalAmount,
                paymentCurrency: 'ALGO',
                paymentType,
                paymentFaculty: studentProfile.faculty,
                paymentDepartment: studentProfile.department
            }

            const payment = await Payment.create(paymentFields)
            if (payment) return res.json(payment)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.payFacultyCharges = async (req, res) => {
    try {
        const { errors, isValid } = validatePayment(req.body)
        const { paymentType, mnemonicKey } = req.body

        if (!isValid) return res.status(400).json(errors)
        const student = await Student.findById(req.user.id)
        const studentProfile = await StudentProfile.findOne({ 'student': req.user.id })
        const fee = await Fee.findOne({ 'paymentType': paymentType })
        const algoSecret = algosdk.mnemonicToSecretKey(mnemonicKey).sk
        const { data: { rate } } = await axios.get("https://rest.coinapi.io/v1/exchangerate/USD/NGN", { headers: { 'X-CoinAPI-Key': process.env.COINAPI_KEY } })
        const algoRate = parseInt(rate.toFixed(2))
        const schoolRate = parseInt(fee.paymentAmount)
        const totalAmount = Math.round(schoolRate / algoRate)
        // console.log(totalAmount)
        // console.log(totalAmount * algoRate)
        const accountInfo = await algoClient.accountInformation(student.algoAddress).do()

        if (accountInfo.amount < totalAmount) return res.status(400).json({ message: 'insufficient balance' })

        // const mn = "shoulder bid nice taxi oven twice wheel exercise ramp hotel together drama gauge parent option powder anchor unlock cement frost toilet identify limb ability divide"
        // const sk = algosdk.mnemonicToSecretKey(mn)

        const params = await algoClient.getTransactionParams().do()
        const signedTXN = algosdk.signTransaction({
            from: student.algoAddress,
            to: fee.paymentAddress,
            fee: 100,
            amount: totalAmount,
            firstRound: params.firstRound,
            lastRound: params.lastRound,
            genesisID: params.genesisID,
            genesisHash: params.genesisHash,
            note: new Uint8Array(0)
        }, algoSecret)
        const sentTRX = await algoClient.sendRawTransaction(signedTXN.blob).do()
        if (sentTRX) {
            const paymentFields = {
                student: req.user.id,
                paymentId: sentTRX.txId,
                amount: totalAmount,
                paymentCurrency: 'ALGO',
                paymentType,
                paymentFaculty: studentProfile.faculty,
                paymentDepartment: studentProfile.department
            }

            const payment = await Payment.create(paymentFields)
            if (payment) return res.json(payment)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.payDepartmentCharges = async (req, res) => {
    try {
        const { errors, isValid } = validatePayment(req.body)
        const { paymentType, mnemonicKey } = req.body

        if (!isValid) return res.status(400).json(errors)
        const student = await Student.findById(req.user.id)
        const studentProfile = await StudentProfile.findOne({ 'student': req.user.id })
        const fee = await Fee.findOne({ 'paymentType': paymentType })
        const algoSecret = algosdk.mnemonicToSecretKey(mnemonicKey).sk
        const { data: { rate } } = await axios.get("https://rest.coinapi.io/v1/exchangerate/USD/NGN", { headers: { 'X-CoinAPI-Key': process.env.COINAPI_KEY } })
        const algoRate = parseInt(rate.toFixed(2))
        const schoolRate = parseInt(fee.paymentAmount)
        const totalAmount = Math.round(schoolRate / algoRate)
        // console.log(totalAmount)
        // console.log(totalAmount * algoRate)
        const accountInfo = await algoClient.accountInformation(student.algoAddress).do()

        if (accountInfo.amount < totalAmount) return res.status(400).json({ message: 'insufficient balance' })

        // const mn = "shoulder bid nice taxi oven twice wheel exercise ramp hotel together drama gauge parent option powder anchor unlock cement frost toilet identify limb ability divide"
        // const sk = algosdk.mnemonicToSecretKey(mn)

        const params = await algoClient.getTransactionParams().do()
        const signedTXN = algosdk.signTransaction({
            from: student.algoAddress,
            to: fee.paymentAddress,
            fee: 100,
            amount: totalAmount,
            firstRound: params.firstRound,
            lastRound: params.lastRound,
            genesisID: params.genesisID,
            genesisHash: params.genesisHash,
            note: new Uint8Array(0)
        }, algoSecret)
        const sentTRX = await algoClient.sendRawTransaction(signedTXN.blob).do()
        if (sentTRX) {
            const paymentFields = {
                student: req.user.id,
                paymentId: sentTRX.txId,
                amount: totalAmount,
                paymentCurrency: 'ALGO',
                paymentType,
                paymentFaculty: studentProfile.faculty,
                paymentDepartment: studentProfile.department
            }

            const payment = await Payment.create(paymentFields)
            if (payment) return res.json(payment)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getSchoolChargesReceipt = async (req, res) => {
    try {
        const schoolReceipt = await Payment.findOne({ 'student': req.user.id, paymentType: 'School Fees' })
        res.json(schoolReceipt)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getFacultyChargesReceipt = async (req, res) => {
    try {
        const facultyReceipt = await Payment.findOne({ 'student': req.user.id, paymentType: 'Faculty Fees' })
        res.json(facultyReceipt)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getDepartmentChargesReceipt = async (req, res) => {
    try {
        const departmentReceipt = await Payment.findOne({ 'student': req.user.id, paymentType: 'Department Fees' })
        res.json(departmentReceipt)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}