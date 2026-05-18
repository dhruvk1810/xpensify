import mongoose from 'mongoose';

const budgetCategorySchema = new mongoose.Schema({
  categoryId: String,
  name: String,
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  color: String,
});

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
    savingsGoal: {
      type: Number,
      default: 0,
    },
    categories: [budgetCategorySchema],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one budget per user per month
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;

