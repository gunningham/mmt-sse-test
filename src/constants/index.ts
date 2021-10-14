import { config } from 'mssql';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// SQL SERVER DETAILS
export const SQL_CONFIG: config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PWD as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_SERVER as string,
};

// CUSTOMER DETAILS API SECRET
export const CUSTOMER_ACCOUNT_DETAILS_API_KEY =
  process.env.CUSTOMER_ACCOUNT_DETAILS_API_KEY;

// SERVER CONFIG
export const PORT = process.env.PORT;
