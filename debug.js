console.log('Debug: Starting...');

try {
  console.log('Debug: Checking .env file...');
  const fs = await import('fs');
  const path = await import('path');
  
  const envExists = fs.existsSync('./.env');
  console.log('Debug: .env exists:', envExists);
  
  if (envExists) {
    console.log('Debug: Loading config...');
    const config = await import('./config/index.js');
    console.log('Debug: Config loaded');
    console.log('Debug: WALLET_PATH:', config.default.WALLET_PATH);
  }
  
  console.log('Debug: All good, should show interface...');
  
} catch (error) {
  console.error('Debug error:', error);
}