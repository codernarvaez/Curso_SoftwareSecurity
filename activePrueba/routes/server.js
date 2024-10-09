const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const ldap = require('ldapjs');

const app = express();
const PORT = 3006;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const userDN = username;

    console.log(`Intentando iniciar sesión con: ${userDN} y contraseña: ${password}`);

    const client = ldap.createClient({
        url: 'ldap://servidor.prueba.local'
    });

    client.bind(userDN, password, (err) => {
        if (err) {
            console.log('Error de autenticación:', err);
            return res.status(401).json({ success: false, message: 'Error: Credenciales incorrectas.' });
        }

        const opts = {
            filter: `(&(objectClass=user)(cn=${username}))`, 
            scope: 'sub',
            attributes: ['*'] 
        };
        
        client.search('DC=prueba,DC=local', opts, (err, search) => {
            if (err) {
                console.error('Error en la búsqueda:', err);
                return;
            }
        
            search.on('searchEntry', (entry) => {
                console.log('Entrada encontrada:', entry);
                console.log('Atributos disponibles:', entry.attributes.map(attr => `${attr.type}: ${attr.values.join(', ')}`));
            
                const sAMAccountNameAttr = entry.attributes.find(attr => attr.type === 'sAMAccountName');
                const memberOfAttr = entry.attributes.find(attr => attr.type === 'memberOf');

                if (sAMAccountNameAttr) {
                    const sAMAccountName = sAMAccountNameAttr.values[0]; 
                    console.log('sAMAccountName encontrado:', sAMAccountName);
                    
                    let groups = [];
                    if (memberOfAttr) {
                        groups = memberOfAttr.values.map(groupDN => {
                            const cnMatch = groupDN.match(/CN=([^,]+)/);
                            return cnMatch ? cnMatch[1] : groupDN; 
                        });
                    }
                    res.json({ success: true, message: 'Usuario autenticado.', sAMAccountName, groups });
                } else {
                    console.log('No se encontró sAMAccountName en la entrada:', entry);
                    res.status(404).json({ success: false, message: 'No se encontró la entrada.' });
                }
            });
            
            search.on('searchReference', (referral) => {
                console.log('Referral:', referral.uris.join());
            });
        
            search.on('error', (err) => {
                console.error('Error en la búsqueda:', err);
            });
        
            search.on('end', (result) => {
                console.log('Búsqueda finalizada:', result);
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
