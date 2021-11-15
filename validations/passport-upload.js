module.exports = function(image){
    if (image) {
        if (image.mimetype === 'image/jpg' || image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') return true;
    }
}