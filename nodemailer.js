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

//5 Al guardar con éxito una imagen se le debe mostrar al usuario un mensaje de agradecimiento por haber colaborado con la NASA.
const correoAgradecimiento = async (email, nombre) => {
    let configCorreo = {
        from: 'chileinfoclub@gmail.comm',
        to: [email],
        subject: `NASA: ¡Gracias por tu aporte!`,
        html: `<h3> ¡Hola ${nombre}! <br> Gracias por tu aporte a la NASA </h3>`,
    };
    await transporter.sendMail(configCorreo)
};

//6) Enviar un correo electrónico a los usuarios cuando se registren indicando que pasarán a revisión y serán notificados cuando se hayan validado sus credenciales.
const correoRegistro = async (email, nombre) => {
    let configCorreo = {
        from: 'chileinfoclub@gmail.comm',
        to: [email],
        subject: `NASA: ¡Gracias por tu registro!`,
        html: `<h3> ¡Hola ${nombre}! <br> Gracias por registrarte en la NASA. pronto validaremos tu cuenta para que puedas acceder y aportar con evidencias </h3>`,
    };
    await transporter.sendMail(configCorreo)
};

//7) Enviar un correo electrónico a los usuarios cuando sean validados en la vista “Admin” notificando que ahora tienen permiso de subir imágenes al sistema.
const correoValidacion = async (email, nombre) => {
    let configCorreo = {
        from: 'chileinfoclub@gmail.comm',
        to: [email],
        subject: 'NASA: ¡Validamos tu cuenta!',
        html: `<h3> ¡Hola ${nombre}! <br> Validamos tu cuenta en la NASA. ahora puedes subir evidencias </h3>`,
    };
    await transporter.sendMail(configCorreo)
};

// exportar funciones de envío
module.exports = {correoAgradecimiento, correoRegistro, correoValidacion};
