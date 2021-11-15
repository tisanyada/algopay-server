const isEmpty = require('./isempty')
const validator = require('validator')


module.exports = function (data) {
    const errors = {}


    data.mnemonicKey = !isEmpty(data.mnemonicKey) ? data.mnemonicKey : ''
    data.personnelMail = !isEmpty(data.personnelMail) ? data.personnelMail : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    if (validator.isEmpty(data.mnemonicKey)) {
        errors.mnemonicKey = 'mnemonicKey is required'
    }

    if (!validator.isEmail(data.personnelMail)) {
        errors.personnelMail = 'invalid mail address'
    }
    if (validator.isEmpty(data.personnelMail)) {
        errors.personnelMail = 'personnel mail is required'
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'password is required'
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}