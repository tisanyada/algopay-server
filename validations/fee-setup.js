const isEmpty = require('./isempty')
const validator = require('validator')


module.exports = function (data) {
    const errors = {}


    data.paymentAddress = !isEmpty(data.paymentAddress) ? data.paymentAddress : ''
    data.paymentType = !isEmpty(data.paymentType) ? data.paymentType : ''
    data.paymentAmount = !isEmpty(data.paymentAmount) ? data.paymentAmount : ''
    

    if (validator.isEmpty(data.paymentAddress)) {
        errors.paymentAddress = 'payment algo wallet address is required'
    }

    if (validator.isEmpty(data.paymentType)) {
        errors.paymentType = 'payment type is required'
    }

    if (validator.isEmpty(data.paymentAmount)) {
        errors.paymentAmount = 'payment amount is required'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}