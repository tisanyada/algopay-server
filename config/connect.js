require('dotenv').config()
const mongoose = require('mongoose')



module.exports = (app) => {
    if (process.env.NODE_ENV === 'production') {
        mongoose.connect(process.env.MONGOURL_PRODUCTION, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
            .then(_ => {
                app.listen(process.env.PORT, console.log(`\n\tserver is running on port: ${process.env.PORT}`));
                console.log('\tconnected to database\n');
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        mongoose.connect(process.env.MONGOURL_LOCAL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
            .then(_ => {
                app.listen(process.env.PORT, console.log(`\n\tserver is running on port: ${process.env.PORT}`));
                console.log('\tconnected to database\n');
            })
            .catch(err => {
                console.log(err);
            });
    }
}