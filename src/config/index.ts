import dotenv from "dotenv";
import path from "path";
import { stripe } from "../lib/stripe";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  admin_email: process.env.ADMIN_EMAIL!,
  admin_password: process.env.ADMIN_PASSWORD!,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expiry: process.env.JWT_ACCESS_EXPIRY!,
  jwt_refresh_expiry: process.env.JWT_REFRESH_EXPIRY!,  
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
};
