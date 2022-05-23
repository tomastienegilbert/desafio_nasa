// Importar dependencias
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'Shhhh';
const PORT = 3000;

const { nuevoUsuario, getUsuarios, setUsuarioStatus, getUsuario } = require('./consultas');
const send = require('./correo');

// Server
app.listen(PORT, () => console.log(`Server ON, PORT ${PORT}`));

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: 'El tamaño de la imagen supera el limite permitido',
    })
);

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);
app.set('view engine', 'handlebars');

// Rutas
app.get('/', (req, res) => {
    res.render('Home')
});

//
app.post('/usuarios', async (req, res) => {
    const { email, nombre, password } = req.body;
    try {
        const usuario = await nuevoUsuario(email, nombre, password);
        res.status(201).send(usuario);
    } catch (error) {
        res.status(500).send({
            error: `Algo salió mal... ${error}`,
            code: 500,
        })
    }
});

//
app.put('/usuarios', async (req, res) => {
    const { id, auth } = req.body;
    try {
        const usuario = await setUsuarioStatus(id, auth);
        res.status(200).send(usuario);
    } catch (error) {
        res.status(500).send({
            error: `Algo salió mal...${error}`,
            code: 500,
        })
    }
});


//
app.get('/Admin', async (req, res) => {

    try {
        const usuarios = await getUsuarios();       // "getUsuarios()" nos va a retornar un arreglo con con todas los usuarios de la base de datos
        res.render('Admin', { usuarios });          // Le pasaremos como parametro a la plantilla el arreglo
    } catch (error) {
        res.status(500).send({
            error: `Algo salió mal... ${error}`,
            code: 500,
        })
    }
});

//
app.get('/Login', (req, res) => {
    res.render('Login');
});

//
app.post('/verify', async (req, res) => {
    // Se obtiene del payload el email y la contraseña
    const { email, password } = req.body;
    // se ejecuta una función "getUsuario", que se comunicará con la base de datos, pasandole el email y la contraseña 
    // esto se realiza para obtener un usuario 
    const user = await getUsuario(email, password);
    /*
    .- En este punto existen tres escenarios posibles:
        1. Que el usuario existe y este autorizado.
        2. Que el usuario exista no esté autorizado.
        3. Que el usuario no exista.
    */
    if (user) {
        // El usuario existe
        if (user.auth) {
            // Y está autorizado
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,   // Tiempo de duración del JWT
                    data: user,
                },
                secretKey
            );
            res.send(token);

            // No esta autorizado 
        } else {
            res.status(401).send({
                error: 'Este usuario aún no ha sido validado para subir imágenes',
                code: 401,
            });
        }
        // El usuario no existe
    } else {
        res.status(404).send({
            error: 'Este usuario aún no esta registrado en la base de datos',
            code: 404,
        });
    }
});


// Ruta GET "/Evidencias"
app.get('/Evidencias', (req, res) => {
    // Verificación del token que recibimos de la "query string" en el req
    const { token } = req.query;
    // Con el metodo "verify", verificamos que el token está vigente y que fue firmado por nuestro servidor, ocupando la "secretKey"
    jwt.verify(token, secretKey, (err, decoded) => { 
        const { data } = decoded    // Estamos destructurando el "decoded" extrayendo el atributo "data", el cual corresponde al "payload" del JWT
        const { nombre, email } = data  // Dentro del "payload" está incluido el "nombre" y el "email"
        err
            ? res.status(401).send(
                res.send({
                    error: '401 Unauthorized',
                    messeage: 'Usted no está autorizado para esta aquí',
                    token_error: err.message,
                })
            )       
            : res.render('Evidencias', { nombre, email });  // Los datos se pasan como parametros a la plantilla de las evidencias

    });
});


// Ruta POST "/upload" que recibirá el archivo y los valores del usuario para hacer el envío del correo electrónico
app.post('/upload', (req, res) => {
    // Verificación si existe algún archivo en el formulario
    // "Object.keys" extrae las propiedades del objeto "files", esto nos devuleve un arreglo de elementos 
    // Si no existe ningun archivo la longitud será 0
    if (Object.keys(req.files).length == 0) {
        // El formulario no está pasando ningún archivo
        return res.status(400).send('No se encontró ningún archivo en la consulta');
    }
    // Del req se extrae el "atributo" "file"
    const { files } = req
    const { foto } = files;  // de files se extrae el archivo con "name" "foto" que corresponde al input de las evidencias
    const { name } = foto;   // de la foto se extrae el atributo "name" que se refiere al nombre del archivo que se va a subir
    const { email, nombre } = req.body  // Del "payload" del cuerpo de la consulta, los que se pasan de manera "oculta" se extrae el email y el nombre
    console.log(req.body)
    console.log(nombre);
    console.log(email);
    // Con el metodo "mv" se indica donde se va almacenar la imagen
    // El callback ejecutará una función asíncrona que en caso de un error retorna un status 500
    foto.mv(`${__dirname}/public/uploads/${name}.jpg`, async (err) => {
        if (err) return res.status(500).send({
            error: `Algo salió mal... ${err}`,
            code: 500,
        })
        // Si no hay errores se ejecutará una función "send()" pasandole el email y nombre para enviarle un correo al usuario
        await send(email, nombre)
        res.send('Foto cargada con éxito');
    });
});
