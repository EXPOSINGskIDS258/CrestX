console.log('1. Starting import test...');

try {
  console.log('2. Testing fs...');
  const { existsSync } = await import('fs');
  console.log('3. fs imported OK');

  console.log('4. Testing path...');
  const { join, dirname } = await import('path');
  console.log('5. path imported OK');

  console.log('6. Testing fileURLToPath...');
  const { fileURLToPath } = await import('url');
  console.log('7. fileURLToPath imported OK');

  console.log('8. Testing setup wizard...');
  const { runSetup } = await import('./src/utils/setupWizard.js');
  console.log('9. setupWizard imported OK');

  console.log('10. Testing userSignalEngine...');
  const userSignalEngine = await import('./src/signalEngine/userSignalEngine.js');
  console.log('11. userSignalEngine imported OK');

  console.log('12. Testing logger...');
  const logger = await import('./src/utils/simpleLogger.js');
  console.log('13. logger imported OK');

  console.log('14. Testing config...');
  const config = await import('./config/index.js');
  console.log('15. config imported OK');

  console.log('16. Testing readline...');
  const readline = await import('readline');
  console.log('17. readline imported OK');

  console.log('18. All imports successful!');

} catch (error) {
  console.error('Import failed:', error);
}