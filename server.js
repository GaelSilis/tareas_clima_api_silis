require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/registro', (req, res) => {
  res.json({
    mensaje: 'Registro recibido',
    datos: req.body
  });
});

module.exports = app;

// Principio de codificación segura: Validación y saneamiento de entradas.
// Se valida que el dato recibido tenga el tipo y tamaño esperados y se
// escapan caracteres especiales para evitar ataques de inyección y XSS.