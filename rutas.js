const express = require('express');
const router = express.Router();
const { postUser, getUser, getUsers, putUser } = require('./db.js');

router.get('/admin', async (req, res) => {
  try {
    const errors = req.flash('errors');
    const success = req.flash('success');
    const user = req.session.user;
    const users = await getUsers();

    if (!users.ok) {
      req.flash('errors', 'Error al obtener usuarios');
      return res.redirect('/admin');
    }
    const usersData = users.data;
    res.render('Admin.html', { errors, success, user, usersData });
  } catch (error) {
    console.log(error);
    res.redirect('/admin');
  }
});

router.get('/evidencias', async (req, res) => {
  try {
    const errors = req.flash('errors');
    const success = req.flash('success');
    const user = req.session.user;
    res.render('Evidencias.html', { errors, success, user });
  } catch (error) {
    console.log(error);
    res.redirect('/evidencias');
  }
});

router.get('/login', async (req, res) => {
  try {
    const errors = req.flash('errors');
    const success = req.flash('success');
    res.render('Login.html', { errors, success });
  } catch (error) {
    console.log(error);
    res.redirect('/login');
  }
});

router.get('/signin', async (req, res) => {
  try {
    const errors = req.flash('errors');
    const success = req.flash('success');
    res.render('Signin.html', { errors, success });
  } catch (error) {
    console.log(error);
    res.redirect('/signin');
  }
});

router.get('/', async (req, res) => {
  try {
    res.redirect('/signin');
  } catch (error) {
    console.log(error);
    res.redirect('/signin');
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { name, email, password, password_confirm } = req.body;

    if (password != password_confirm) {
      req.flash('errors', 'Contraseñas no coinciden');
      return res.redirect('/');
    }

    const newUser = await postUser(name, email, password);

    if (!newUser.ok) {
      req.flash('errors', newUser.error);
      return res.redirect('/');
    }

    req.flash('success', 'Usuario creado con exito');
    res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('errors', error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await getUser(email);

    if (!user.ok) {
      req.flash('errors', user.error);
      return res.redirect('/login');
    }

    if (user.data.password == !password) {
      req.flash('errors', 'Contraseña o usuario incorrecto');
      return res.redirect('/login');
    }

    req.session.user = user.data;
    res.redirect('/evidencias');
  } catch (error) {
    console.log(error);
    req.flash('errors', error.message);
    res.redirect('/login');
  }
});

router.put('/admin', async (req, res) => {
  try {
    const { id, auth } = req.body;

    const updateUser = await putUser(id, auth);

    if (!updateUser.ok) {
      req.flash('errors', updateUser.error);
      return res.redirect('/admin');
    }

    req.flash('success', 'Usuario actualizado con exito');
    res.send();
  } catch (error) {
    console.log(error);
    req.flash('errors', error.message);
    res.redirect('/admin');
  }
});

module.exports = router;