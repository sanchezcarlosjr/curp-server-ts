import * as express from 'express';
import * as cors from 'cors';
import {findMexican} from "./controllers/CurpController";
import {ensureIsValidApiKey} from "./middlewares/user";
import { initializeApp } from 'firebase-admin/app';

initializeApp();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(ensureIsValidApiKey);

app.get('/', (request: express.Request, response: express.Response) => {
    response.status(301).redirect("https://carlos-eduardo-sanchez-torres.sanchezcarlosjr.com/curp-renapo-api");
});

app.get('/curp/:curp', findMexican);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
