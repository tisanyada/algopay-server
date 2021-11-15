const { Schema, model } = require('mongoose')



const StudentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'students'
    },
    fullName: {
        type: String,
        required: true
    },
    schoolMail: {
        type: String,
        required: true,
        unique: true
    },
    algoAddress: {
        type: String,
        required: true,
        unique: true
    },
    matriculationNumber: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    passport: {
        type: String,
        required: true,
        default: 'null'
    }
}, {
    timestamps: true
})



module.exports = model('studentprofiles', StudentSchema)