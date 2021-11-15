const { Schema, model } = require('mongoose')



const PaymentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentCurrency: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentFaculty: {
        type: String,
        required: true
    },
    paymentDepartment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = model('payments', PaymentSchema)