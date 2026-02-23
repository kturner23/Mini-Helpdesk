const express = require('express');
const router = express.Router();
const db = require('./db');

console.log('routes.js loaded');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// DB test
router.get('/test-db', (req, res) => {
  db.get('SELECT 1 as ok', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Database connected successfully', row });
  });
});

// CREATE ticket
router.post('/tickets', (req, res) => {
  const { title, description = '', status = 'Open', priority = 'Normal' } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title is required (min 3 characters).' });
  }

  const sql = `
    INSERT INTO tickets (title, description, status, priority)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [title.trim(), description, status, priority], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: this.lastID,
      title: title.trim(),
      description,
      status,
      priority
    });
  });
});

// READ all tickets
router.get('/tickets', (req, res) => {
  db.all('SELECT * FROM tickets ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// READ one ticket
router.get('/tickets/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Ticket not found.' });
    res.json(row);
  });
});

// UPDATE ticket (partial update)
router.put('/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  const fields = [];
  const values = [];

  if (title !== undefined) {
    if (title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters.' });
    }
    fields.push('title = ?');
    values.push(title.trim());
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
  }
  if (priority !== undefined) {
    fields.push('priority = ?');
    values.push(priority);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Provide at least one field to update.' });
  }

  // update timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');

  const sql = `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Ticket not found.' });
    res.json({ message: 'Ticket updated', id });
  });
});

// DELETE ticket
router.delete('/tickets/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tickets WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Ticket not found.' });
    res.json({ message: 'Ticket deleted', id });
  });
});

module.exports = router;
