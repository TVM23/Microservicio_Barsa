// /init-user.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient } = require('mongodb');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs');

void (async () => {
  const uri = 'mongodb://mongo:27017'; // nombre del servicio en docker-compose
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.INIT_USER_DB || 'test');
    const collection = db.collection('users');

    const exists = await collection.findOne({ nombreUsuario: process.env.INIT_USER_USERNAME });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(process.env.INIT_USER_PASSWORD, 10);

      await collection.insertOne({
        nombre: process.env.INIT_USER_NAME,
        apellidos: process.env.INIT_USER_LASTNAME,
        nombreUsuario: process.env.INIT_USER_USERNAME,
        email: process.env.INIT_USER_EMAIL,
        password: hashedPassword,
        rol: process.env.INIT_USER_ROLE,
        estado: true,
      });

      console.log('✅ Usuario inicial creado.');
    } else {
      console.log('ℹ️ El usuario ya existe.');
    }
  } catch (err) {
    console.error('❌ Error creando usuario inicial:', err);
  } finally {
    await client.close();
  }
})();
