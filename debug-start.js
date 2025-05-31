console.log('Step 1: Starting debug...');

try {
  console.log('Step 2: Checking .env...');
  const fs = await import('fs');
  const envExists = fs.existsSync('./.env');
  console.log('Step 3: .env exists:', envExists);
  
  if (envExists) {
    console.log('Step 4: Loading config...');
    const config = await import('./config/index.js');
    console.log('Step 5: Config loaded successfully');
    
    console.log('Step 6: Creating readline...');
    const readline = await import('readline');
    
    const rl = readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('Step 7: Asking question...');
    
    const answer = await new Promise((resolve) => {
      rl.question('Test question (type anything): ', (ans) => {
        rl.close();
        resolve(ans);
      });
    });
    
    console.log('Step 8: Got answer:', answer);
    console.log('Step 9: All working!');
  }
} catch (error) {
  console.error('Debug error:', error);
}