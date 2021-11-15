const isEmpty = require('./isempty')
const validator = require('validator')


module.exports = function (data) {
    const errors = {}


    data.fullName = !isEmpty(data.fullName) ? data.fullName : ''
    data.schoolMail = !isEmpty(data.schoolMail) ? data.schoolMail : ''
    data.algoAddress = !isEmpty(data.algoAddress) ? data.algoAddress : ''
    data.matriculationNumber = !isEmpty(data.matriculationNumber) ? data.matriculationNumber : ''
    data.faculty = !isEmpty(data.faculty) ? data.faculty : ''
    data.department = !isEmpty(data.department) ? data.department : ''
    data.level = !isEmpty(data.level) ? data.level : ''
    data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : ''
    // data.passport = !isEmpty(data.passport) ? data.passport : ''


    if (validator.isEmpty(data.fullName)) {
        errors.fullName = 'fullname is required'
    }

    if (!validator.isEmail(data.schoolMail)) {
        errors.schoolMail = 'invalid school mail address'
    }
    if (validator.isEmpty(data.schoolMail)) {
        errors.schoolMail = 'school mail is required'
    }

    if (validator.isEmpty(data.algoAddress)) {
        errors.algoAddress = 'algo wallet address is required'
    }

    if (validator.isEmpty(data.matriculationNumber)) {
        errors.matriculationNumber = 'matriculation number is required'
    }

    if (validator.isEmpty(data.faculty)) {
        errors.faculty = 'fullname is required'
    }

    if (validator.isEmpty(data.department)) {
        errors.department = 'department is required'
    }

    if (validator.isEmpty(data.level)) {
        errors.level = 'level is required'
    }

    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'phone number is required'
    }

    // if (validator.isEmpty(data.passport)) {
    //     errors.passport = 'passport photograph is required'
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}