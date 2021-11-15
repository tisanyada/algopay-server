require('dotenv').config()
const algosdk = require('algosdk')

const token = {
    'X-API-Key': process.env.ALGOD_API_KEY,
}
const baseServer = process.env.ALGOD_API_SERVER
const port = ''


module.exports = new algosdk.Algodv2(token, baseServer, port)