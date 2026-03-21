const fs = require('fs');
const zlib = require('zlib');

//___________________________Q1___________________________//

const readstream = fs.createReadStream('big.txt');

readstream.on('data', (chunk) => {
    console.log(chunk);
});

//___________________________Q2___________________________//

fs.copyFile('big.txt', 'big_copy.txt', (err) => {
    if (err) throw err;
    console.log('File copied successfully.');
});

//___________________________Q3___________________________//

const writestream = fs.createWriteStream('big_copy.txt.gz');
const compress = zlib.createGzip();
readstream.pipe(compress).pipe(writestream);