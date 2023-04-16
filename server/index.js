const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "04f16972752a925e37c426aa61d5144d1ffddad43fb8054e4222cf7922c18e8f448366c3e1c9d16bd904a6d63f650498d928086d58eef500e25789cd9e8f3b3922": 100,
  "04ba1f1cdc4e56a55b4c5e332ba67e6a635ae529fa3e92a5d942218dccb7c803ae74b34b8ddb80e989f82025deb16fa4b4e9a811e2c9cf9788f2241b8665c28520": 50,
  "044a8b5826704acb6572752d9df446c6c6246518b6f32ada9438d4348d99f882a3bb30b71fc81e03736dee7ba6dbd6206e70edbdddaf22e79abb68accaa3361b3c": 75,
  "04e8e3a0f4b3ac3b9100b8b861db21e44a95680de8cc0b6c914511bff356e05c80eb1be9ee9e5dcabf447d1a5c76860dc3fb4c4aafe68f158a1d34fd2168c439d7": 40
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { recipient, amount, signature, message } = req.body;
  console.log("Signature: ", signature);
  const messageBytes = utf8ToBytes(message);
  console.log("messageBytes: ", messageBytes);
  console.log("TEST");
  // console.log("Signature1: ", Buffer.from(JSON.parse(signature[0]).data));
  let sender = await secp.recoverPublicKey(keccak256(messageBytes), hexToBytes(signature[0]), signature[1]);
  sender = toHex(sender);
  console.log("sender: ", sender);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
