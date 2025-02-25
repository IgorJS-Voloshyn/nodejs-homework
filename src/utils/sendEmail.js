import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
const transport = nodemailer.createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  secure: false,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

export function sendEmail(options) {
  return transport.sendMail(options);
}
