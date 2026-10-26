import React, { useState } from 'react';
import { EventProject, BudgetCategory, ExpenseItem } from '../types';

interface BudgetTrackerViewProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onShowToast: (message: string) => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
}

export const BudgetTrackerView: React.FC<BudgetTrackerViewProps> = ({
  event,
  onUpdateEvent,
  onShowToast,
  onOpenCopilotWithPrompt,
}) => {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(event.budgetCategories[0]?.id || 'cat-1');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseStatus, setExpenseStatus] = useState<'paid' | 'pending' | 'escrow'>('paid');

  const [newCatName, setNewCatName] = useState('');
  const [newCatAllocated, setNewCatAllocated] = useState('');
  const [newCatNotes, setNewCatNotes] = useState('');

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingAllocated, setEditingAllocated] = useState('');

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [contingencyPct, setContingencyPct] = useState<number>(10);
  const [contingencyActive, setContingencyActive] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<'actual' | 'optimized'>('actual');

  // Keep expenseCategory synchronized with event categories
  React.useEffect(() => {
    if (event.budgetCategories && event.budgetCategories.length > 0) {
      const exists = event.budgetCategories.some((c) => c.id === expenseCategory);
      if (!exists) {
        setExpenseCategory(event.budgetCategories[0].id);
      }
    }
  }, [event.id, event.budgetCategories]);

  // Deterministic financial calculations
  const rawPlannedCeiling = event.budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const contingencyReserveAmount = contingencyActive ? Math.round(rawPlannedCeiling * (contingencyPct / 100)) : 0;
  const totalPlannedCeiling = rawPlannedCeiling + contingencyReserveAmount;
  const totalActualSpent = event.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingLiquidVault = (event.totalBudget || rawPlannedCeiling) - totalActualSpent - contingencyReserveAmount;
  const spentPct = totalPlannedCeiling > 0 ? Math.round((totalActualSpent / totalPlannedCeiling) * 100) : 0;

  // Category spent amounts calculated deterministically from expenses
  const categorySpentMap: Record<string, number> = {};
  event.expenses.forEach((exp) => {
    categorySpentMap[exp.categoryId] = (categorySpentMap[exp.categoryId] || 0) + exp.amount;
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const alloc = Number(newCatAllocated);
    if (!newCatName.trim() || alloc <= 0) {
      onShowToast('Please provide a valid category title and allocated amount.');
      return;
    }

    const newCategory: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      allocated: alloc,
      spent: 0,
      color: '#b76dff',
      icon: 'category',
      notes: newCatNotes.trim() || undefined,
    };

    const updatedCats = [...event.budgetCategories, newCategory];
    const newTotal = updatedCats.reduce((sum, c) => sum + c.allocated, 0);

    onUpdateEvent({
      ...event,
      budgetCategories: updatedCats,
      totalBudget: newTotal,
    });

    setNewCatName('');
    setNewCatAllocated('');
    setNewCatNotes('');
    setShowAddCategoryModal(false);
    onShowToast(`Category "${newCategory.name}" added to budget plan.`);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(expenseAmount);
    if (!expenseTitle.trim() || amountNum <= 0) {
      onShowToast('Please provide a valid title and amount.');
      return;
    }

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      categoryId: expenseCategory,
      title: expenseTitle.trim(),
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      vendor: expenseVendor.trim() || 'Direct Settlement',
      status: expenseStatus,
    };

    const updatedExpenses = [newExpense, ...event.expenses];
    const newSpent = updatedExpenses.reduce((sum, item) => sum + item.amount, 0);

    onUpdateEvent({
      ...event,
      expenses: updatedExpenses,
      spentBudget: newSpent,
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseVendor('');
    setShowAddExpenseModal(false);
    onShowToast(`Logged expense of ₹${amountNum.toLocaleString('en-IN')} for ${newExpense.title}`);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = event.expenses.filter((e) => e.id !== id);
    const newSpent = updated.reduce((sum, item) => sum + item.amount, 0);
    onUpdateEvent({
      ...event,
      expenses: updated,
      spentBudget: newSpent,
    });
    onShowToast('Expense entry deleted.');
  };

  const handleSaveCategoryAllocation = (catId: string) => {
    const newAlloc = Number(editingAllocated);
    if (newAlloc <= 0) return;

    const updatedCats = event.budgetCategories.map((c) =>
      c.id === catId ? { ...c, allocated: newAlloc } : c
    );
    const newTotal = updatedCats.reduce((sum, c) => sum + c.allocated, 0);

    onUpdateEvent({
      ...event,
      budgetCategories: updatedCats,
      totalBudget: newTotal,
    });

    setEditingCategoryId(null);
    onShowToast(`Category budget updated to ₹${newAlloc.toLocaleString('en-IN')}`);
  };

  const filteredExpenses =
    selectedFilterCategory === 'all'
      ? event.expenses
      : event.expenses.filter((e) => e.categoryId === selectedFilterCategory);

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              Deterministic Financial Guard
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              INR (₹) Real-time Sync
            </span>
          </div>
          <h1 className="font-display-hero text-headline-xl sm:text-headline-xl text-on-surface tracking-tight">
            Budget Planner &amp; Ledger
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Track planned allocations against actual vendor invoices with automated overspending alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCopilotWithPrompt('Analyze my event budget and identify 15% cost savings')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-body-sm text-body-sm hover:bg-surface-container-highest transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>AI Cost Arbitrage</span>
          </button>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[14px] font-semibold shadow-[0_0_24px_rgba(183,109,255,0.4)] hover:shadow-[0_0_32px_rgba(183,109,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Contingency Reserve & Scenario Modeling Strip */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setContingencyActive(!contingencyActive);
              onShowToast(contingencyActive ? 'Contingency reserve deactivated.' : `Contingency reserve of ${contingencyPct}% locked.`);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-label-mono-sm text-[12px] font-semibold transition-all cursor-pointer ${
              contingencyActive
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {contingencyActive ? 'verified_user' : 'shield'}
            </span>
            <span>Contingency Reserve ({contingencyActive ? 'Active' : 'Off'})</span>
          </button>

          {contingencyActive && (
            <div className="flex items-center gap-1">
              {[5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setContingencyPct(pct);
                    onShowToast(`Contingency reserve set to ${pct}% (₹${Math.round(rawPlannedCeiling * (pct / 100)).toLocaleString('en-IN')})`);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-label-mono-sm transition-all cursor-pointer ${
                    contingencyPct === pct
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <span className="text-[11px] font-label-mono-sm text-primary ml-1">
                +₹{contingencyReserveAmount.toLocaleString('en-IN')} Buffer
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-outline text-[16px]">info</span>
          <span>Estimates are market approximations, not binding quotes. Edit any category allocation below.</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase">
            Total Target Ceiling
          </span>
          <div className="my-2">
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              ₹{totalPlannedCeiling.toLocaleString('en-IN')}
            </div>
            <p className="text-caption text-on-surface-variant">Combined planned categories</p>
          </div>
          <div className="text-[11px] font-label-mono-sm text-secondary">Currency: Indian Rupee</div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase">
            Actual Disbursed
          </span>
          <div className="my-2">
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              ₹{totalActualSpent.toLocaleString('en-IN')}
            </div>
            <div className="w-full bg-surface-container-lowest rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  spentPct > 90 ? 'bg-error' : 'bg-primary-container'
                }`}
                style={{ width: `${Math.min(100, spentPct)}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] font-label-mono-sm text-on-surface-variant">
            {spentPct}% of target consumed
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase">
            Remaining Liquid Vault
          </span>
          <div className="my-2">
            <div
              className={`font-headline-lg text-headline-lg font-bold ${
                remainingLiquidVault < 0 ? 'text-error' : 'text-primary'
              }`}
            >
              ₹{remainingLiquidVault.toLocaleString('en-IN')}
            </div>
            <p className="text-caption text-on-surface-variant">
              {remainingLiquidVault < 0
                ? 'OVER BUDGET WARNING'
                : 'Available liquid reserves'}
            </p>
          </div>
          <span className="text-[11px] font-label-mono-sm text-emerald-400">
            {remainingLiquidVault < 0 ? 'Exceeded by ₹' + Math.abs(remainingLiquidVault).toLocaleString('en-IN') : 'Escrow Guard Active'}
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase">
            Disbursement Count
          </span>
          <div className="my-2">
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {event.expenses.length} Records
            </div>
            <p className="text-caption text-on-surface-variant">
              {event.expenses.filter((e) => e.status === 'paid').length} Paid •{' '}
              {event.expenses.filter((e) => e.status === 'escrow').length} Escrow
            </p>
          </div>
          <span className="text-[11px] font-label-mono-sm text-secondary">
            Zero Discrepancies
          </span>
        </div>
      </div>

      {/* Category Wise Breakdown Grid with Interactive Progress */}
      <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Category-Wise Allocation &amp; Performance
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Click on any allocated budget to adjust planned targets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary text-[12px] font-label-mono-sm hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>New Category</span>
            </button>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              {event.budgetCategories.length} Active Categories
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {event.budgetCategories.map((cat) => {
            const actual = categorySpentMap[cat.id] || 0;
            const pct = cat.allocated > 0 ? Math.round((actual / cat.allocated) * 100) : 0;
            const isOver = actual > cat.allocated;
            const isEditing = editingCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-space-md rounded-xl bg-surface-container-low border transition-all ${
                  isOver ? 'border-error/50 bg-error-container/10' : 'border-outline-variant/25'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-[15px] font-semibold text-on-surface">
                        {cat.name}
                      </h3>
                      {cat.notes && (
                        <p className="text-caption text-on-surface-variant truncate max-w-[180px]">
                          {cat.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {isOver && (
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[10px] uppercase font-bold">
                      Overspent
                    </span>
                  )}
                </div>

                {/* Amounts */}
                <div className="flex items-end justify-between my-2">
                  <div>
                    <span className="text-caption font-label-mono-sm text-on-surface-variant block uppercase">
                      Spent
                    </span>
                    <span className="font-headline-sm text-[18px] font-bold text-on-surface">
                      ₹{actual.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-caption font-label-mono-sm text-on-surface-variant block uppercase">
                      Planned
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={editingAllocated}
                          onChange={(e) => setEditingAllocated(e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-surface-container text-right text-[13px] border border-primary focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveCategoryAllocation(cat.id)}
                          className="p-1 rounded bg-primary text-on-primary"
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditingAllocated(String(cat.allocated));
                        }}
                        className="font-headline-sm text-[16px] text-secondary hover:text-primary transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        title="Click to edit planned target"
                      >
                        <span>₹{cat.allocated.toLocaleString('en-IN')}</span>
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden my-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-error' : 'bg-primary-container'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-label-mono-sm text-on-surface-variant pt-1">
                  <span>{pct}% utilized</span>
                  <span className={isOver ? 'text-error font-semibold' : 'text-emerald-400'}>
                    {isOver
                      ? `+₹${(actual - cat.allocated).toLocaleString('en-IN')} excess`
                      : `₹${(cat.allocated - actual).toLocaleString('en-IN')} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Item Ledger Section */}
      <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Disbursement Transactions Ledger
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Every invoice and payment logged with deterministic bookkeeping.
            </p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-caption font-label-mono-sm text-on-surface-variant">Filter:</span>
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories ({event.expenses.length})</option>
              {event.budgetCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-8 rounded-xl bg-surface-container-low text-center text-on-surface-variant font-body-sm">
            No expenses recorded under this category yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 font-label-mono-sm text-[11px] text-on-surface-variant uppercase">
                  <th className="py-3 px-3">Title / Description</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Vendor / Recipient</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-body-sm text-[13px]">
                {filteredExpenses.map((exp) => {
                  const cat = event.budgetCategories.find((c) => c.id === exp.categoryId);
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-surface-container-high/50 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-medium text-on-surface">
                        {exp.title}
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-[11px] font-label-mono-sm">
                          {cat?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant">
                        {exp.vendor || 'Direct'}
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant font-label-mono-sm text-[12px]">
                        {exp.date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-mono-sm text-[10px] uppercase font-bold ${
                            exp.status === 'paid'
                              ? 'bg-emerald-950 text-emerald-300'
                              : exp.status === 'escrow'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-headline-sm text-[15px] font-bold text-on-surface">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-highest transition-colors cursor-pointer"
                          title="Delete expense"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                  Record New Expense
                </h3>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Expense Description
                </label>
                <input
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Stage lighting trussing second advance"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Amount (₹ INR)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Category Bucket
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    {event.budgetCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Vendor / Payee
                  </label>
                  <input
                    value={expenseVendor}
                    onChange={(e) => setExpenseVendor(e.target.value)}
                    placeholder="e.g. Violet Dreams Decor"
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Payment Status
                  </label>
                  <select
                    value={expenseStatus}
                    onChange={(e) => setExpenseStatus(e.target.value as any)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    <option value="paid">Paid &amp; Cleared</option>
                    <option value="escrow">Held in Escrow</option>
                    <option value="pending">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-body-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold cursor-pointer shadow-md"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">category</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                  Add Budget Category
                </h3>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Category Name
                </label>
                <input
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Invitations & Stationery"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Allocated Budget Target (₹ INR)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={newCatAllocated}
                  onChange={(e) => setNewCatAllocated(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Notes / Scope (Optional)
                </label>
                <input
                  value={newCatNotes}
                  onChange={(e) => setNewCatNotes(e.target.value)}
                  placeholder="e.g. Custom wax seals and metallic foil embossing"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-body-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold cursor-pointer shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
