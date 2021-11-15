const isEmpty = require('./isempty')
const validator = require('validator')
const passwordValidator = require('password-validator')


module.exports = function (data) {
    const errors = {}

    const passwordSchema = new passwordValidator()
    passwordSchema
        .has().uppercase()


    data.personnelID = !isEmpty(data.personnelID) ? data.personnelID : ''
    data.facultyName = !isEmpty(data.facultyName) ? data.facultyName : ''
    data.facultyID = !isEmpty(data.facultyID) ? data.facultyID : ''
    data.personnelMail = !isEmpty(data.personnelMail) ? data.personnelMail : ''
    data.fullName = !isEmpty(data.fullName) ? data.fullName : ''
    data.algoAddress = !isEmpty(data.algoAddress) ? data.algoAddress : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : ''



    if (validator.isEmpty(data.personnelID)) {
        errors.personnelID = 'personnel identication number is required'
    }

    if (validator.isEmpty(data.facultyName)) {
        errors.facultyName = 'faculty name is required'
    }

    if (validator.isEmpty(data.facultyID)) {
        errors.facultyID = 'faculty identication number is required'
    }

    if (validator.isEmpty(data.fullName)) {
        errors.fullName = 'personnel fullname is required'
    }

    if (!validator.isEmail(data.personnelMail)) {
        errors.personnelMail = 'invalid mail address'
    }
    if (validator.isEmpty(data.personnelMail)) {
        errors.personnelMail = 'school mail is required'
    }


    if(validator.isEmpty(data.algoAddress)){
        errors.algoAddress = 'algo wallet address is required'
    }

    if (!validator.isLength(data.password, { min: 6, max: 12 })) {
        errors.password = 'password must be between six(6) and twelve(12) characters'
    }
    if (!passwordSchema.validate(data.password)) {
        errors.password = 'password must have at least one uppercase character'
    }
    if (!validator.equals(data.password, data.confirm_password)) {
        errors.password = 'passwords mismatch'
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'password is required'
    }
    if (validator.isEmpty(data.confirm_password)) {
        errors.confirm_password = 'confirm password is required'
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}