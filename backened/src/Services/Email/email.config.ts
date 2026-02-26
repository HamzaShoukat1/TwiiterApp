import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.API_TOKEN;

export const mailtrapclient = new MailtrapClient({
    token: TOKEN || ''
});

export const sender = {
    email: "hello@demomailtrap.co",
    name: "Hamza",
};


// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         html: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);