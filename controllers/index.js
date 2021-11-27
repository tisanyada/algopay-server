const Payment = require('../models/Payment')



exports.getReceipt = async (req, res) => {
    try {
        const { receiptId } = req.params
        const receipt = await Payment.findById(receiptId)
            .populate('student').select('-createdAt -updatedAt -__v')
            .select('-createdAt -updatedAt -__v')

        if (receipt) return res.json(receipt)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}

exports.verifyReceipt = async (req, res) => {
    try {
        const { receiptId } = req.params
        const receipt = await Payment.findById(receiptId)
        receipt.verified = !receipt.verified
        await receipt.save()

        if (receipt) {
            return res.json(receipt)
        } else {
            console.log('error')
            return res.status(500).json({ message: 'an error occured while updating receipt' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}