import express from 'express';
import Budget from '../models/Budget.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get budget for a specific month/year
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = { user: req.userId };
    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    const budget = await Budget.findOne(query).sort({ year: -1 });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/budgets
// @desc    Create or update budget
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { month, year, income, savingsGoal, categories } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // Try to find existing budget
    let budget = await Budget.findOne({ user: req.userId, month, year: parseInt(year) });

    if (budget) {
      // Update existing
      if (income !== undefined) budget.income = income;
      if (savingsGoal !== undefined) budget.savingsGoal = savingsGoal;
      if (categories) budget.categories = categories;
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        user: req.userId,
        month,
        year: parseInt(year),
        income: income || 0,
        savingsGoal: savingsGoal || 0,
        categories: categories || [],
      });
    }

    res.json(budget);
  } catch (error) {
    console.error('Save budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update budget categories
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.userId });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const { income, savingsGoal, categories } = req.body;

    if (income !== undefined) budget.income = income;
    if (savingsGoal !== undefined) budget.savingsGoal = savingsGoal;
    if (categories) budget.categories = categories;

    await budget.save();
    res.json(budget);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

