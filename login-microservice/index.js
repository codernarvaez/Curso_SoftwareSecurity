const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
//LINK
//CERRAR SECION: http://localhost:3006/logout
//LOGIN: http://localhost:3006/auth/google
//principal: http://localhost:3006/dashboard


// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Inicializa Passport y la sesión
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport con Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    //  perfil del usuario 
    return done(null, profile);
  }
));

// Serialización del usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Rutas para autenticación con Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/dashboard');
});

// Ruta para el logout
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
      }
      // Redirigir al usuario a la página principal después de cerrar sesión
      res.redirect('/');
    });
  });
});


// Ruta protegida
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  
  // Accede al correo electrónico desde el perfil del usuario
  const userEmail = req.user.emails[0].value; // Obtén el correo del usuario
  res.send(`Hola ${req.user.displayName}, bienvenido a tu dashboard. Tu correo es: ${userEmail}`);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
