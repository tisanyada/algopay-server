const isEmpty = require('./isempty')
const validator = require('validator')
const passwordValidator = require('password-validator')


module.exports = function (data) {
    const errors = {}

    const passwordSchema = new passwordValidator()
    passwordSchema
        .has().uppercase()


    data.schoolMail = !isEmpty(data.schoolMail) ? data.schoolMail : ''
    data.algoAddress = !isEmpty(data.algoAddress) ? data.algoAddress : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : ''

    if(!validator.isEmail(data.schoolMail)){
        errors.schoolMail = 'invalid school mail address'
    }
    if(validator.isEmpty(data.schoolMail)){
        errors.schoolMail = 'school mail is required'
    }

    if(validator.isEmpty(data.algoAddress)){
        errors.algoAddress = 'algo wallet address is required'
    }

    if(!validator.isLength(data.password, {min: 6, max: 12})){
        errors.password = 'password must be between five(6) and twelve(12) characters'
    }
    if(!passwordSchema.validate(data.password)){
        errors.password = 'password must have at least one uppercase character'
    }
    if(!validator.equals(data.password, data.confirm_password)){
        errors.password = 'passwords mismatch'
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'password is required'
    }
    if(validator.isEmpty(data.confirm_password)){
        errors.confirm_password = 'confirm password is required'
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}