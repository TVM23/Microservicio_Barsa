import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer"

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendResetPasswordEmail(email: string, token: string) {

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Recuperación de contraseña',
          text: `Usa este token para restablecer tu contraseña: ${token}`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }
}