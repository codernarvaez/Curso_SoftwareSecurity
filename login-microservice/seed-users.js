const User = require('./models/user'); 

async function seedUsers() {
  try {
    await User.bulkCreate([
      { google_id: 'google_id_1', email: 'karen.b.gonzaga@unl.edu.ec', name: 'Noche', authorized: true },
      { google_id: 'google_id_2', email: 'thais.cartuche@unl.edu.ec', name: 'Usuario 2', authorized: false },
      { google_id: 'google_id_3', email: 'hilary.calva@unl.edu.ec', name: 'Hilary', authorized: true },
      { google_id: 'google_id_4', email: 'cristian.narvaez@unl.edu.ec', name: 'Cristian', authorized: true },
    ]);

    console.log('Usuarios creados exitosamente.');
  } catch (error) {
    console.error('Error al crear los usuarios:', error);
  }
}

seedUsers();