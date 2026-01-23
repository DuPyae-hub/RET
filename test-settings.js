// Quick test to check if settings are in the database
const mysql = require('mysql2/promise');

async function testSettings() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'RET_Database',
  });

  try {
    const [rows] = await connection.execute(
      'SELECT `key`, `value` FROM site_settings WHERE `key` IN ("mission","vision","history","attitude","coreValues")'
    );
    console.log('Settings in database:');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

testSettings();
