const express = require("express");
const bodyParser = require("body-parser");
const { Blockchain, Block } = require("./blockchain");

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blockchain = new Blockchain();

app.get("/", (req, res) => {
  res.render("index", { certificateId: null });
});

app.post("/issue-certificate", (req, res) => {
  const { recipient, certificateName } = req.body;
  const certificateId = generateCertificateId();
  const newBlock = new Block(blockchain.chain.length, new Date().toString(), {
    certificateId,
    recipient,
    certificateName,
  });
  blockchain.addBlock(newBlock);
  console.log(newBlock);
  res.render("index", { certificateId });
});

app.get("/verify-certificate/", (req, res) => {
  res.render("verify", { isValid: null });
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/verify-certificate", (req, res) => {
  const { certificateId } = req.body;
  const block = blockchain.chain.find(
    (block) => block.data.certificateId === certificateId
  );
  const isValid = block !== undefined;
  res.render("verify", { certificateId, isValid });
});

function generateCertificateId() {
  return Math.random().toString(36).substring(2, 10);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
