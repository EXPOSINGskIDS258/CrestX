import readline from 'readline';

console.log('🚀 Simple Test');
console.log('Testing readline...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter something: ', (answer) => {
  console.log(`You entered: ${answer}`);
  rl.close();
});