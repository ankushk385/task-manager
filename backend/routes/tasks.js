const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');

// Create task
router.post('/', [
  body('title').notEmpty(),
  body('priority').optional().isIn(['Low','Medium','High']),
  body('status').optional().isIn(['Pending','In Progress','Done'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const t = new Task({ ...req.body, userId: req.user.id });
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks with filtering, sorting, pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, sortBy } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let sort = {};
    if (sortBy === 'priority') sort = { priority: 1 };
    else if (sortBy === 'createdAt') sort = { createdAt: -1 };

    const tasks = await Task.find(filter)
      .sort(sort)
      .skip((page-1)*limit)
      .limit(Number(limit));
    const total = await Task.countDocuments(filter);
    res.json({ data: tasks, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', [
  body('priority').optional().isIn(['Low','Medium','High']),
  body('status').optional().isIn(['Pending','In Progress','Done'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
