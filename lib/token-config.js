require('dotenv').config()
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const Faculty = require('../models/Faculty')
const Department = require('../models/Department')


const { KEYS, PRIVKEY, PUBKEY } = process.env
const pathToPrivKey = path.join(__dirname, KEYS, PRIVKEY)
const pathToPubKey = path.join(__dirname, KEYS, PUBKEY)
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8')
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8')


module.exports = {
    issueJwt: (user) => {
        const payload = {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        }

        return `Bearer ${jwt.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'PS512' })}`;
    },
    issueStudentJwt: (student) => {
        const payload = {
            id: student._id,
            schoolMail: student.schoolMail,
            algoAddress: student.algoAddress
        }

        return `Bearer ${jwt.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'PS512' })}`;
    },
    protectStudentRoute: async (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, PUB_KEY, { algorithms: ['PS512'] })
                req.user = await Student.findById(decoded.id).select('-password -createdAt -updatedAt -__v')
                next()
            } catch (error) {
                console.log(error)
            }
        }
    },
    issueFacultyJwt: (personnel) => {
        const payload = {
            id: personnel._id,
            personnelID: personnel.personnelID,
            facultyID: personnel.facultyID,
            facultyName: personnel.facultyName,
            personnelMail: personnel.personnelMail,
            fullName: personnel.fullName,
            algoAddress: personnel.algoAddress
        }

        return `Bearer ${jwt.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'PS512' })}`;
    },
    protectFacultyRoute: async (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, PUB_KEY, { algorithms: ['PS512'] })
                req.user = await Faculty.findById(decoded.id).select('-password -createdAt -updatedAt -__v')
                next()
            } catch (error) {
                console.log(error)
            }
        }
    },
    issueDepartmentJwt: (personnel) => {
        const payload = {
            id: personnel._id,
            personnelID: personnel.personnelID,
            facultyName: personnel.facultyName,
            departmentID: personnel.departmentID,
            departmentName: personnel.departmentName,
            personnelMail: personnel.personnelMail,
            fullName: personnel.fullName,
            algoAddress: personnel.algoAddress
        }

        return `Bearer ${jwt.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'PS512' })}`;
    },
    protectDepartmentRoute: async (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, PUB_KEY, { algorithms: ['PS512'] })
                req.user = await Department.findById(decoded.id).select('-password -createdAt -updatedAt -__v')
                next()
            } catch (error) {
                console.log(error)
            }
        }
    }
}