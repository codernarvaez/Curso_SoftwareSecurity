const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const ldap = require('ldapjs');
const path = require('path');

const app = express();
const PORT = 3006;

// Middleware
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static('public'));
app.use(session({ secret: 'mi_secreto', resave: false, saveUninitialized: true }));

// Ruta para manejar la autenticación
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const client = ldap.createClient({
        url: 'ldap://192.168.213.50'
    });

    const userDN = `cn=${username},OU=Empresa,DC=prueba,DC=local`;

    console.log(`Intentando iniciar sesión con: ${userDN} y contraseña: ${password}`);

    client.bind(userDN, password, (err) => {
        if (err) {
            console.log('Error de autenticación:', err);
            console.error('Error de autenticación:', err);
            return res.status(401).json({ message: 'Error: Credenciales incorrectas.' });
        }
        req.session.user = username;
        res.json({ message: '¡Inicio de sesión exitoso!' });
        client.unbind();
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
