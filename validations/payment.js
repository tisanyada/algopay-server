const isEmpty = require('./isempty')
const validator = require('validator')


module.exports = function (data) {
    const errors = {}


    data.paymentType = !isEmpty(data.paymentType) ? data.paymentType : ''
    


    if (validator.isEmpty(data.paymentType)) {
        errors.paymentType = 'payment type is required'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}