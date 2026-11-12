// API Gateway: the only entry point. Forwards each request to the right microservice.
const express = require('express');

const PORT = process.env.PORT || 3000;
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:3001';
const DELETE_URL = process.env.DELETE_URL || 'http://delete-service:3002';

const app = express();
app.use(express.json());

// Send the request to a service and return its answer to the client
async function forward(res, url, method, body) {
  try {
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(502).json({ message: 'Service unavailable', error: err.message });
  }
}

app.post('/api/register', (req, res) => forward(res, `${REGISTRATION_URL}/register`, 'POST', req.body));
app.get('/api/students', (req, res) => forward(res, `${REGISTRATION_URL}/students`, 'GET'));
app.delete('/api/students/:id', (req, res) =>
  forward(res, `${DELETE_URL}/students/${encodeURIComponent(req.params.id)}`, 'DELETE'));

app.get('/health', (req, res) => res.json({ service: 'api-gateway', status: 'ok' }));

app.listen(PORT, () => console.log(`api-gateway on port ${PORT}`));
