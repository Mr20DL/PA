import express from 'express';
import ProcessService from '../business/processService.js';
import { supabase } from '../data/supabaseClient.js'; // Importar directamente

const router = express.Router();
const processService = new ProcessService();

// Crear nuevo proceso
router.post('/processes', async (req, res) => {
  try {
    const process = await processService.createProcess(req.body);
    res.status(201).json({
      metadata: { 
        timestamp: new Date(),
        action: 'process_created'
      },
      data: process
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ejecutar planificación
router.post('/execute', async (req, res) => {
  try {
    const { algorithm } = req.body;
    const result = await processService.executeProcesses(algorithm);
    
    res.json({
      metadata: {
        timestamp: new Date(),
        algorithm,
        processesExecuted: result.length
      },
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener logs de ejecución
router.get('/logs', async (req, res) => {
  try {
    const logs = await processService.getExecutionLogs();
    res.json({
      metadata: {
        count: logs.length,
        source: 'Supabase'
      },
      data: logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tiempo real con WebSockets
router.get('/processes/realtime', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const channel = supabase // Usar supabase importado directamente
    .channel('process-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'processes'
    }, (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    })
    .subscribe();

  req.on('close', () => {
    channel.unsubscribe();
    res.end();
  });
});

export default router;