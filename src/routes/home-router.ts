import express = require('express')
const router = express.Router()

// Pagina de Inicio
router.get('/', (request: express.Request, response: express.Response) => {
  return response.status(201).redirect("https://carlos-eduardo-sanchez-torres.sanchezcarlosjr.com/curp-renapo-api");
});

export default router;