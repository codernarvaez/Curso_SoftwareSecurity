const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./models/user'); // Asegúrate de que la ruta sea correcta
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializa Express
const app = express();
const PORT = process.env.PORT || 3006;

// Configuración de la base de datos
const sequelize = new Sequelize('mydb', 'myuser', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres'
});

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_aqui', // Secreto para firmar la cookie
  resave: false,
  saveUninitialized: false, // Cambia esto a false para no guardar sesiones no inicializadas
  cookie: { secure: false } // Asegúrate de que esté en true si estás usando HTTPS
}));


app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport para Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Busca el usuario por google_id
    let user = await User.findOne({ where: { google_id: profile.id } });

    if (!user) {
      // Si no existe, buscarlo por email
      user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        // Crear un nuevo usuario solo si no existe
        user = await User.create({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authorized: false
        });
      } else {
        // Si el usuario existe, actualizar su google_id si es necesario
        user.google_id = profile.id;
        await user.save();
      }
    }

    // Llamar a done con el usuario encontrado o creado
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

// Rutas
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirigir después de la autenticación exitosa
    res.redirect('/dashboard');
  }
);

// Ruta para el dashboard 
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    // Verificar si el usuario está autorizado
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


// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  console.log('Cerrando sesión...');
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/dashboard'); // Redirigir al dashboard en caso de error
    }
    console.log('Sesión cerrada.');

    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
        return res.redirect('/dashboard'); // Redirigir en caso de error
      }
      console.log('Sesión destruida.');

      res.clearCookie('connect.sid'); // Asegúrate de que el nombre de la cookie sea correcto
      res.redirect('/'); // Redirigir a la página de inicio después de cerrar sesión
    });
  });
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('Página de inicio. <a href="/auth/google">Iniciar sesión con Google</a>');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});