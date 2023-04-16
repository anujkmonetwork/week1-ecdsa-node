const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);

console.log("Private Key: ", utils.toHex(privateKey));
console.log("Public Key: ", utils.toHex(publicKey));