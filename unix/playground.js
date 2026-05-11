const { spawn, exec } = require("node:child_process");
const {stdin, stdout, stderr} = require('node:process');

stdin.on('data', (data) => {
  console.log('STDIN DATA: ', data.toString());
});
stdout.write('SOME TEXT FOR STDOUT \n');
stderr.write('TEXT I DON\'T WANT!...\n');
stdout.on('data', (data) => {
  console.log('STDOUT: ', data.toString());
});
stdout.on('close', (code) => {
  if(code === 0) {
    console.log('Everything is ok!')
  }
})

// console.log('CWD: ', process.cwd());

// //echo "something string" | tr ' ' '\n'

// // Ищет только то, что находится в пути! НЕ АЛИАСЫ ИЛИ ФУНКЦИИ + СУБФУНКЦИИ
// const subprocess = spawn(
//   "ls", 
//   ["-la"], 
//   { process: process.env } // по умолчанию. Можно указать {mode: 'production'}
// );
// console.log("playgrou....", process.env);
// console.log('PATH: ', process.env.PATH);
// subprocess.stdout.on("data", (data) => {
//   console.log("DATA: ", data.toString());
// });

// console.log("++++++++++++++++++++++++++++++");

// exec(
//   "echo 'something string' | tr ' ' '\n'",
//   { shell: "/bin/bash" },
//   (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);

//     console.log("STD_ERR: ", stderr);
//   },
// );
