const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')


const StudentSchema = new Schema({
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
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

StudentSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}


module.exports = model('students', StudentSchema)