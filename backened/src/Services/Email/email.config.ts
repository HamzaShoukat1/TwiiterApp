import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.API_TOKEN;

export const mailtrapclient = new MailtrapClient({
    token: TOKEN || ''
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Twitter Support",
};


