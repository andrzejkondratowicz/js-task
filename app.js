const fs = require('fs');
const path = require('path');
const BankSystemModel = require('./modules/models/bankSystem.model');

const FILE_ENCODING = 'utf8';

function main() {
  const bankSystem = new BankSystemModel();
  const fileName = process.argv[2];
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, FILE_ENCODING, async (err, data) => {
    if (err) {
      console.log(err);
    }

    await bankSystem.init();
    bankSystem.executeOperationsList(JSON.parse(data));
  });
}

main();
