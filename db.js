const { Pool } = require('pg');
const { rows, password } = require('pg/lib/defaults');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgresql',
    database: 'nasa',
    port: 5432,
});

// Los usuarios registrados deben tener por lo menos las siguientes propiedades:
// ● Email
// ● Nombre
// ● Contraseña
const nuevoUsuario = async (email, nombre, password) => {

    const result = await pool.query(
        `INSERT INTO usuarios (email, nombre, password, auth) values ('${email}', '${nombre}', '${password}', false) RETURNING *`
    );
    const usuario = result.rows[0];
    return usuario;
}

//
const getUsuarios = async () => {
    const result = await pool.query(`SELECT * FROM usuarios`);
    return result.rows;

}

//// Los usuarios registrados deben tener por lo menos las siguientes propiedades:
// ● auth (Booleano que definirá si el usuario está autorizado para subir fotos)
const setUsuarioStatus = async (id, auth) => {
    const result = await pool.query(
        `UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *`
    );
    const usuario = result.rows[0];
    return usuario;
}

// Función "getUsuario" para confirmar que el usuario existe en la base de datos
const getUsuario = async (email, password) => {
    const result = await pool.query(
        `SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}'`
    );
    return result.rows[0];    
    
}


module.exports = {
    nuevoUsuario,
    getUsuarios,
    setUsuarioStatus, 
    getUsuario
}