const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./models/user'); 
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006;

const sequelize = new Sequelize('mydb', 'myuser', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.KEY, 
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: false } 
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { google_id: profile.id } });

    if (!user) {
      user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        user = await User.create({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authorized: false
        });
      } else {
        user.google_id = profile.id;
        await user.save();
      }
    }
    return done(null, user);
  } catch (error) {
    console.error('Error al crear o buscar el usuario:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.authorized) {
      res.send(`
        <h1>Bienvenido ${req.user.name}</h1>
        <a href="/logout">Cerrar sesión</a>
      `);
    } else {
      res.send(`
        <h1>No tienes permiso para acceder a esta página.</h1>
        <p>Tu cuenta no ha sido autorizada. Por favor, contacta a un administrador.</p>
        <a href="/">Volver a la página de inicio</a>
      `);
    }
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  console.log('Cerrando sesión...');
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/dashboard'); 
    }
    console.log('Sesión cerrada.');

    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
        return res.redirect('/dashboard');
      }
      console.log('Sesión destruida.');
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

app.get('/', (req, res) => {
  res.send('Página de inicio. <a href="/auth/google">Iniciar sesión con Google</a>');
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});