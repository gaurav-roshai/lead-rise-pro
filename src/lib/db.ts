// lib/db.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

export const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Database initialization script
export const initializeDatabase = async () => {
  const connection = await getConnection();
  
  // Create leads table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      sector VARCHAR(100),
      region VARCHAR(100),
      contact_person_name VARCHAR(255),
      contact_person_role VARCHAR(255),
      contact_person_email VARCHAR(255),
      lead_source VARCHAR(100),
      product_name VARCHAR(255),
      initial_use_case TEXT,
      stage VARCHAR(50),
      deal_value DECIMAL(10, 2),
      deal_type VARCHAR(50),
      sales_owner VARCHAR(255),
      probability VARCHAR(10),
      date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create activities table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      activity_title VARCHAR(255) NOT NULL,
      activity_type VARCHAR(100),
      activity_description TEXT,
      date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialized successfully');
};