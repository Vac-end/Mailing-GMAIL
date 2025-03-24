import app from './shared/server';
import sequelize from './shared/database/database';
import { appConfig } from './shared/database/config';
import dotenv from 'dotenv';
dotenv.config();

const force = process.env.FORCE;
const alter = process.env.ALTER;

if (force === 'true'){
  sequelize.sync({ force: true });
  console.log("Base de datos Dropeada y Subida Correctamente");
}if(alter === 'true'){
  sequelize.sync({ alter : true });
  console.log("Base de Datos Actualizada")
}else{
  console.log("Base sin actualizaciones"); 
}

sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
  app.listen(appConfig.port, () => {
    console.log(`Microservicio de mailing corriendo en el puerto ${appConfig.port}`);
  });
}).catch((err) => {
  console.error('Error al sincronizar la base de datos', err);
});
