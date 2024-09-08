const { TOTP } = require('totp-generator')
const nodemailer = require('nodemailer')

const generateOTP = async () => {
    try {
        const otp = await TOTP.generate(process.env.SECRET_KEY, {
            digits: 4,
            period: 1
        });
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
}

const sendMail = async (email,otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass:  process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: "polaroids@gmail.com",
        to: `${email}`,
        subject: 'OTP Verification',
        // text: 'Hello world?',
        html: `${otp}` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    
}

module.exports = {
    generateOTP,
    sendMail
}