import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

// pvt key: bab39596c78b15dbabae61cb3fa25b510e8bf480ec1906f157a98ae012991179
// pub key: 04e8e3a0f4b3ac3b9100b8b861db21e44a95680de8cc0b6c914511bff356e05c80eb1be9ee9e5dcabf447d1a5c76860dc3fb4c4aafe68f158a1d34fd2168c439d7
function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, signature, setSignature }) {
  async function onChange(evt) {
    const key = evt.target.value;
    const publicKey = await secp.getPublicKey(hexToBytes(key));
    address = toHex(publicKey);
    setAddress(address);

    const message = "GET_BALANCE";
    const messageBytes = utf8ToBytes(message);
    signature = await secp.sign(keccak256(messageBytes), key, { recovered: true });
    console.log(await secp.verify(signature, keccak256(messageBytes), address));
    console.log("signature: ", signature);
    window.signature = signature;
    setPrivateKey(privateKey);
    // setSignature(signature);
    const add = await secp.recoverPublicKey(keccak256(messageBytes), signature[0], signature[1]);
    console.log(toHex(add));

    signature[0] = toHex(signature[0]);
    setSignature(signature);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  // 2100db759f5ceb77d92eca651fafc37c0b20167a7410ceebe7278227a4f4ad5e

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key: 
        <input placeholder="Enter private key: , for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Wallet Address: {address}
      </div>
      <div>
        Signature: {signature}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
