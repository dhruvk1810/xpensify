import express from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { description, amount, category, type, paymentMode, icon, cardLast4, status, date } = req.body;

    if (!description || !amount || !category || !type || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await Transaction.create({
      user: req.userId,
      description,
      amount,
      category,
      type,
      paymentMode: paymentMode || 'cash',
      icon: icon || 'shopping-cart',
      cardLast4: cardLast4 || '',
      status: status || 'completed',
      date: new Date(date),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { description, amount, category, type, paymentMode, icon, status, date } = req.body;

    if (description) transaction.description = description;
    if (amount !== undefined) transaction.amount = amount;
    if (category) transaction.category = category;
    if (type) transaction.type = type;
    if (paymentMode) transaction.paymentMode = paymentMode;
    if (icon) transaction.icon = icon;
    if (status) transaction.status = status;
    if (date) transaction.date = new Date(date);

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/transactions
// @desc    Delete multiple transactions
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide transaction IDs' });
    }

    await Transaction.deleteMany({ _id: { $in: ids }, user: req.userId });

    res.json({ message: `${ids.length} transaction(s) deleted` });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

