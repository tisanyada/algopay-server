const crypto = require('crypto');
const fs = require('fs');



(() => {

	try {
		const keyPair = crypto.generateKeyPairSync('rsa', {
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			}
		});

		fs.writeFileSync(__dirname + '/RSA_priv_key.pem', keyPair.privateKey);
		fs.writeFileSync(__dirname + '/RSA_pub_key.pem', keyPair.publicKey);


		// process.exit(1);
	} catch (error) {
		console.log(error);
	}

})();