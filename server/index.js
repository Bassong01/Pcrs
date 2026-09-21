const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { initRealtime } = require('./realtime');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
initRealtime(httpServer);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/cases', require('./routes/cases.routes'));
app.use('/api/persons', require('./routes/persons.routes'));
app.use('/api/records', require('./routes/records.routes'));
app.use('/api/alerts', require('./routes/alerts.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/audit', require('./routes/audit.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

httpServer.listen(PORT, () => {
  console.log(`\n🛡️  PCRS Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health\n`);
});
