const bcrypt = require('bcryptjs');

async function testHash() {
  const hash = '$2b$10$npauCy3OmoZRWSMfDCfLGO1AfbaCFv54unyLryPZ6SsX0gFPhVuqC';
  const passwordsToTest = ['password123', 'admin123', 'Admin123', 'Admin123!', '123456', 'Password123!', 'password'];
  
  for (const pw of passwordsToTest) {
    const isMatch = await bcrypt.compare(pw, hash);
    console.log(`Testing '${pw}': ${isMatch}`);
  }
}

testHash();
