import express from 'express';
import dotenv from 'dotenv';
import webApi from './presentacion/web-api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', webApi);

app.get('/', (req, res) => {
  res.send(`
    <h1>Sistema de Planificación de Procesos</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li>POST /api/processes - Crear proceso</li>
      <li>POST /api/execute - Ejecutar procesos</li>
      <li>GET /api/logs - Ver logs</li>
      <li>GET /api/processes/realtime - SSE para cambios</li>
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});