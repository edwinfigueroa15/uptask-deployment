const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')

const generarHtml = (archivo, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, options)
    return juice(html)
}

exports.main = async (options) => {

    const html = generarHtml(options.archivo, options)
    const text = htmlToText.fromString(html)

    let transport = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
        },
    });

    let info = await transport.sendMail({
        from: 'UpTask <no-replay@uptask.com>',
        to: options.usuario.email,
        subject: options.subject,
        text,
        html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
}