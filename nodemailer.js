// Importacion de la dependencia
const nodemailer = require('nodemailer');
// Creación del "transporter", indicando el servicio y credenciales 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fasatalfa@shile.com',
        pass: 'fasat@lfa22',
    },
});

// 7. Enviar un correo electrónico a los usuarios cuando sean validados en la vista “Admin”
// notificando que ahora tienen permiso de subir imágenes al sistema.
const send = async (email, nombre) => {
    let correoAgradecimiento = {
        from: 'fasatalfa@shile.com',
        to: [email],
        subject: `¡Saludos desde la NASA!`,
        html: `<h3> ¡Hola!, ${nombre} <br> La NASA te da las gracias por subir tu foto en nuestro sistema y colaborar con nuestras investigaciones </h3>`,
    };
    await transporter.sendMail(correoAgradecimiento)
};

//Enviar un correo electrónico a los usuarios cuando sean validados en la vista “Admin” notificando que ahora tienen permiso de subir imágenes al sistema.
const confirmacionValidacion = async (email, nombre) => {
    let correoValidacion = {
        from: 'fasatalfalfa@shile.com',
        to: [email],
        subject: `¡Cuenta validada!`,
        html: `<h3> ¡Hola!, ${nombre} <br> Tu cuenta ha sido validada, ahora puedes subir fotos en nuestro sistema </h3>`,
    };
    await transporter.sendMail(correoValidacion)
};

// exportar send
module.exports = {
    send,
    confirmacionValidacion,
};