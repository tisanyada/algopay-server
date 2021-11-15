const { Schema, model } = require('mongoose')


const FeeSchema = new Schema({
    paymentAddress: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentAmount: {
        type: String,
        required: true
    }
}, {
    timestamp: true
})


module.exports = model('fees', FeeSchema)