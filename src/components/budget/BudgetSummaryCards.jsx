import React from 'react';
import { StatCard } from '../dashboard/StatCard';

export function BudgetSummaryCards({ income, savingsGoal, incomeChange, savingsGoalChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <StatCard
        title="Monthly Income"
        value={income}
        change={incomeChange}
        type="income"
        isLoading={false}
      />
      <StatCard
        title="Savings Goal"
        value={savingsGoal}
        change={savingsGoalChange}
        type="savings"
        isLoading={false}
      />
    </div>
  );
}