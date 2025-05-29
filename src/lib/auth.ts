import { betterAuth} from "better-auth"
import { createPool } from "mysql2/promise";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  appName: "Authentication",
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "admin",
    })
  ],
  database: createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: "9Jyy0JULrA40fRPZ0QSAos6kysHv5gZl",
  // advanced: {
  //   defaultCookieAttributes: {
  //     secure: true,
  //     httpOnly: true,
  //     sameSite: "strict",
  //     partitioned: true,
  //   },
  //   useSecureCookies: true,
  // }
});