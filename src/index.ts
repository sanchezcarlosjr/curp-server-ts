import * as express from 'express';
import * as cors from 'cors';
/**
 * ? ¿Deseas conectarte al servicio de FIREBASE?
 * ! Entonces importalo de la siguiente manera para inicializarlo de manera correcta con tus claves.
 *
 * * Inicializaras la conexión de la siguiente forma:
 *
 * * const params = {
 * *   type: serviceAccount.type,
 * *   projectId: serviceAccount.project_id,
 * *   privateKeyId: serviceAccount.private_key_id,
 * *   privateKey: serviceAccount.private_key,
 * *   clientEmail: serviceAccount.client_email,
 * *   clientId: serviceAccount.client_id,
 * *   authUri: serviceAccount.auth_uri,
 * *   tokenUri: serviceAccount.token_uri,
 * *   authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
 * *   clientC509CertUrl: serviceAccount.client_x509_cert_url
 * *   }
 * * --admin.initializeApp({ credential: admin.credential.cert(params)});-
 */
import * as admin from 'firebase-admin';
/**
 * * Logré ver que en el servidor web creaste variables de entorno
 * ! Cada vez que necesites leer una variable de entorno es necesario llamar el módulo: --require("dotenv").config();--
 * ! en caso de no hacerlo ocasionarás errores al ejecutar tu aplicación
 *
 * ? ¿Estás tratando de importar datos de un archivo y la ubicación está en una variable de entorno?
 * ? Por ejemplo: GOOGLE_APPLICATION_CREDENTIALS="./service-account-credentials.json"
 * * Lamento informar que no se podrá, debido a que en la exportación e importación no se permiten usar variables de ningún tipo,
 * * por lo que es necesario una STRING literalmente. Por ejemplo:\
 * ! FORMA INCORRECTA 1:
 * ! .env: GOOGLE_APPLICATION_CREDENTIALS=./service-account-credentials.json
 * ! ERROR: --import * as serviceAccount from process.env.GOOGLE_APPLICATION_CREDENTIALS;--
 *
 * ! FORMA INCORRECTA 2:
 * ! .env: GOOGLE_APPLICATION_CREDENTIALS=./service-account-credentials.json
 * ! const _path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
 * ! ERROR: --import * as serviceAccount from _path;--
 *
 * * FORMA CORRECTA:
 * * NO ERROR: --import * as serviceAccount from '../service-account-credentials.json';--
 */

import * as serviceAccount from '../service-account-credentials.json';
require("dotenv").config();

//* INICIARLIZAR CONEXIÓN A FIREBASE
const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
}
admin.initializeApp({ credential: admin.credential.cert(params) });

const PORT = process.env.PORT || 3000;

export const app = express();

/**
 * * ROUTE INDEX
 *
 * Para evitar que este archivo crezca por estar añadiendo rutas,
 * desarrollé un sistema de rutas en el cúal estará llevando el proceso.
 */
import { routes } from './routes/index';
routes();

/**
 * * CORS
 * ! Por el momento el CORS será abierto a cualquier origen,
 * ! sin embargo,se eliminará por que haré un middleware,
 * ! que funcionará de manera parecida.
 */
app.use(cors({
  origin: '*'
}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
