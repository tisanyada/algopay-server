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
    paidTo: {
        type: String,
        required: true
    },
    studentAlgoId: {
        type: String,
        required: true
    },
    matriculationNumber: {
        type: String,
        required: true
    },
    fullName: {
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
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})


module.exports = model('payments', PaymentSchema)