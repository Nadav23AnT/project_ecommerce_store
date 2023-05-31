/* eslint-disable class-methods-use-this */
import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { IUsers } from '@Interfaces/userType';

export default class Email {
  public to: string;

  public firstName: string;

  public url: string;

  public from: string;

  constructor(user: IUsers, url: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendinBlue
      return nodemailer.createTransport({
        // service: 'SendinBlue',
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,
        // auth: {
        //   user: process.env.SENDINBLUE_USERNAME,
        //   pass: process.env.SENDINBLUE_SMTP_KEY,
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`./views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      adminName: process.env.EMAIL_FROM?.split(' ')[0],
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'ברוכים הבאים לאתר שלנו!');
  }

  async sendConfirmEmail() {
    await this.send('confirmEmail', 'לחץ על הקישור כדי לאמת את המייל שלך!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'הסיסמה הזמנית שלך לאיפוס הסיסמה (תקף ל10 דקות)'
    );
  }
}
