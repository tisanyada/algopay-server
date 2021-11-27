const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')



const DepartmentSchema = new Schema({
    personnelID: {
        type: String,
        required: true
    },
    departmentID: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    personnelMail: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    algoAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



DepartmentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

DepartmentSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}



module.exports = model('departments', DepartmentSchema)