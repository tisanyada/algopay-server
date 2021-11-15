const isEmpty = require('./isempty')
const validator = require('validator')


module.exports = function (data) {
    const errors = {}


    data.mnemonicKey = !isEmpty(data.mnemonicKey) ? data.mnemonicKey : ''
    data.schoolMail = !isEmpty(data.schoolMail) ? data.schoolMail : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    if (validator.isEmpty(data.mnemonicKey)) {
        errors.mnemonicKey = 'mnemonicKey is required'
    }

    if (!validator.isEmail(data.schoolMail)) {
        errors.schoolMail = 'invalid school mail address'
    }
    if (validator.isEmpty(data.schoolMail)) {
        errors.schoolMail = 'school mail is required'
    }


    if (validator.isEmpty(data.password)) {
        errors.password = 'password is required'
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}