const path = require('path')
const Multer = require('multer')

const maxSize = 1 * 1024 * 1024

const upload = Multer({
    storage: Multer.diskStorage({}),
    filefilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('File type is not supported'), false)
            return
        }
        cb(null, true)
    },
    limits: { fileSize: maxSize }
}).single('image')


module.exports = upload