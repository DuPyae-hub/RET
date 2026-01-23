// Debug script to check database directly
const mysql = require('mysql2/promise');

async function debugSettings() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'RET_Database',
  });

  try {
    console.log('=== Checking site_settings table ===');
    const [rows] = await connection.execute(
      'SELECT `key`, `value` FROM site_settings WHERE `key` IN ("mission","vision","history","attitude","coreValues")'
    );
    console.log('Raw rows:', JSON.stringify(rows, null, 2));
    console.log('\n=== Processed settings ===');
    rows.forEach(row => {
      console.log(`${row.key}: ${row.value}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

debugSettings();
