const {stdin, stdout, stderr, argv} = require('node:process');
const fs = require('node:fs/promises');
const { pipeline } = require('node:stream');

const [...rest, filePath, prefix, separator] = argv;

if(!filePath || !prefix || !separator) {
  console.error('NO ARGUMENTS TO FORMATE.');
}else {
  let numChunk = '';
  stdin.on('data', async(data) => {
    let stringData = data.toString();

    const arrFormatted = [];

    for(let i = 0; i<stringData.length; i++) {
      if(stringData[i] != ' ') {
         numChunk +=stringData[i];
      }else {
        if(numChunk.length > 3) {
          const sepLength = Math.trunc(numChunk / 3);
          const startSepIdx = numChunk.length - sepLength*3 -1;
          let counterSep = sepLength;

          let withSeparotor = `${separator}`;
          for(let j = 0; j<numChunk.length; j++) {
            if(j <startSepIdx) {
              withSeparotor.push(numChunk[j]);
            }else {
              counterSep--;
              withSeparotor.push(`.${numChunk.slice(i, i+3)}`);
              j+=3;
            }

          }
          withSeparotor.push(' ');
          
          arrFormatted.push(withSeparotor);
          

          
          
        }
      }
    }

    let fd;
    let writeStream;

    try {
      fd = await fs.open(filePath, 'w');
      writeStream = fd.createWriteStream();

      pipeline()
    } catch (error) {
      
    }

  });

 

  stdin.on('close', (code) => {
    if(code === 0) {
      console.log('====OK===')
    }else {
      console.log('===BAD===');
    }
  });

   stderr.on('data', (err) => {
    console.error(err);
  });
}