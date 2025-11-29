import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const sendEmail = async (to: string, subject: string, text: string) => {
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
        console.warn('Email credentials not found. Skipping email sending.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // Helps with some cloud proxy cert issues
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 10000,   // 10 seconds
        logger: true,
        debug: true,
    } as nodemailer.TransportOptions);

    const mailOptions = {
        from: env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};
