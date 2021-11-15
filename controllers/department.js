const Fee = require('../models/Fee')


const validateFeeSetup = require('../validations/fee-setup')


exports.setCharges = async (req, res) => {
    try {
        const { errors, isValid } = validateFeeSetup(req.body)
        const { paymentAddress, paymentType, paymentAmount } = req.body

        if (!isValid) return res.status(400).json(errors)

        const isFee = await Fee.findOne({ 'paymentType': paymentType })

        if (isFee) {
            errors.paymentType = 'payment setup of this type has been set'
            return res.status(400).json(errors)
        }

        const fee = await Fee.create({ paymentAddress, paymentType, paymentAmount })
        if (fee) return res.json(fee)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}