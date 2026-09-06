import dotenv from "dotenv";
import path from "path";
import { stripe } from "../lib/stripe";
import { fr } from "zod/locales";

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
  google_client_id: process.env.GOOGLE_CLIENT_ID!,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL!,
  frontend_url: process.env.FRONTEND_URL!,
};
