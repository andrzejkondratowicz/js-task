const fs = require('fs');
const path = require('path');
const BankSystemModel = require('./modules/bankSystem/bankSystem.model');

const FILE_ENCODING = 'utf8';

function main() {
  const bankSystem = new BankSystemModel();
  const fileName = process.argv[2];
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, FILE_ENCODING, (err, data) => {
    if (err) {
      console.log(err);
    }

    bankSystem.executeOperationsList(JSON.parse(data));
  });
}

main();
