// Importacion de la dependencia
const nodemailer = require('nodemailer');
// Creación del "transporter", indicando el servicio y credenciales 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chileinfoclub@gmail.com',
        pass: '2022@infoclub',
    },
});

// Función asíncrona "send()" que recibe el email y el nombre 
const send = async (email, nombre) => {
    let mailOptions = {
        from: 'chileinfoclub@gmail.com',
        to: [email],
        subject: `¡Saludos desde la NASA!`,
        html: `<h3> ¡Hola!, ${nombre} <br> La NASA te da las gracias por subir tu foto en nuestro sistema y colaborar con nuestras investigaciones </h3>`,
    };
    await transporter.sendMail(mailOptions)
};

// exportar send
module.exports = send;