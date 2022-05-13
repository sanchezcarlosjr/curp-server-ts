import * as express from 'express';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../service-account-credentials.json';
require("dotenv").config();

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

import routes from './routes';
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
