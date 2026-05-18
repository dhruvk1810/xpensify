import { useState, useEffect } from 'react';
import {
  Search, Download, Calendar, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, Pencil, IndianRupee, Check
} from 'lucide-react';
import { ShoppingCart, Zap, Film, Car, Coffee, Briefcase, Laptop, RefreshCw, Bus, UtensilsCrossed, Heart, GraduationCap, Wallet, ShoppingBasket, Receipt, Coins, TrendingUp, Gift } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog.jsx';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu.jsx';
import { SelectBox } from '@/components/ui/select-box';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import { getTransactions, updateTransaction, deleteTransaction, deleteTransactions } from '@/lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const iconMap = {
  'shopping-cart': ShoppingCart,
  'shopping-basket': ShoppingBasket,
  'receipt': Receipt,
  'zap': Zap,
  'film': Film,
  'car': Car,
  'coffee': Coffee,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'refresh-cw': RefreshCw,
  'bus': Bus,
  'utensils': UtensilsCrossed,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'wallet': Wallet,
  'coins': Coins,
  'trending-up': TrendingUp,
  'gift': Gift,
};

const categoryColors = {
  'Groceries': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Utilities': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Entertainment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Transport': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Food & Drink': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Salary': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Side Income': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Freelance': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Investment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Gift': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Refund': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Shopping': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Healthcare': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Education': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

const expenseCategories = [
  'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Food & Drink',
  'Shopping', 'Healthcare', 'Education', 'Other',
];

const incomeCategories = [
  'Salary', 'Side Income', 'Freelance', 'Investment', 'Gift', 'Refund',
];

const paymentModes = [
  { id: 'cash', label: 'Cash' },
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'debit_card', label: 'Debit Card' },
  { id: 'upi', label: 'UPI / Digital' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
];

const categoryOptions = [
  { value: '__expense_header__', label: 'Expense', disabled: true },
  ...expenseCategories.map((cat) => ({ value: cat, label: cat })),
  { value: '__income_header__', label: 'Income', disabled: true },
  ...incomeCategories.map((cat) => ({ value: cat, label: cat })),
];

const categoryIconMap = {
  'Groceries': 'shopping-basket',
  'Utilities': 'receipt',
  'Entertainment': 'film',
  'Transport': 'bus',
  'Food & Drink': 'utensils',
  'Shopping': 'shopping-cart',
  'Healthcare': 'heart',
  'Education': 'graduation-cap',
  'Other': 'wallet',
  'Salary': 'briefcase',
  'Side Income': 'coins',
  'Freelance': 'trending-up',
  'Investment': 'wallet',
  'Gift': 'gift',
  'Refund': 'refresh-cw',
};

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [singleDeleteTarget, setSingleDeleteTarget] = useState(null);
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    paymentMode: 'cash',
  });
  const [updateErrors, setUpdateErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const transactionsPerPage = 10;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setAllTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const tDate = new Date(t.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        matchesDate = tDate >= today;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = tDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDate = tDate >= monthAgo;
      }
    }

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSelection = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTransactions.length === currentTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentTransactions.map((t) => t._id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteTransactions(selectedTransactions);
      await loadTransactions();
      setSelectedTransactions([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  const openSingleDelete = (transaction) => {
    setSingleDeleteTarget(transaction);
    setSingleDeleteOpen(true);
  };

  const handleSingleDelete = async () => {
    if (!singleDeleteTarget) return;
    try {
      await deleteTransaction(singleDeleteTarget._id);
      await loadTransactions();
      setSingleDeleteTarget(null);
      setSingleDeleteOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const openUpdate = (transaction) => {
    setUpdateTarget(transaction);
    setUpdateForm({
      description: transaction.description || '',
      amount: String(transaction.amount || ''),
      category: transaction.category || '',
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      paymentMode: transaction.paymentMode || 'cash',
    });
    setUpdateErrors({});
    setUpdateOpen(true);
  };

  const validateUpdate = () => {
    const errs = {};
    if (!updateForm.description.trim()) errs.description = 'Description is required';
    if (!updateForm.amount || Number(updateForm.amount) <= 0) errs.amount = 'Valid amount required';
    if (!updateForm.category) errs.category = 'Category is required';
    if (!updateForm.date) errs.date = 'Date is required';
    setUpdateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateSubmit = async () => {
    if (!validateUpdate()) return;
    const isIncome = incomeCategories.includes(updateForm.category);
    try {
      await updateTransaction(updateTarget._id, {
        description: updateForm.description.trim(),
        amount: Number(updateForm.amount),
        category: updateForm.category,
        type: isIncome ? 'income' : 'expense',
        icon: categoryIconMap[updateForm.category] || 'shopping-cart',
        date: updateForm.date,
        paymentMode: updateForm.paymentMode,
      });
      await loadTransactions();
      setUpdateOpen(false);
      setUpdateTarget(null);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  async function handleExportCSV() {
    if (filteredTransactions.length === 0) return;

    // Define headers
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Mode', 'Status'];

    // Map data to rows
    const rows = filteredTransactions.map(t => {
      const date = new Date(t.date).toLocaleDateString();
      const description = `"${t.description.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
      const category = t.category;
      const type = t.type;
      const amount = t.amount.toFixed(2);
      const mode = t.paymentMode || 'cash';
      const status = t.status || 'completed';

      return [date, description, category, type, amount, mode, status].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportPDF() {
    if (filteredTransactions.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('Transactions Report', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Transactions: ${filteredTransactions.length}`, 14, 36);

    const tableData = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type.toUpperCase(),
      `Rs. ${t.amount.toLocaleString()}`,
      t.paymentMode || 'cash'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount', 'Mode']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] },
      styles: { fontSize: 8 },
    });

    doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Transaction History</h1>
          {selectedTransactions.length > 0 && (
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
              {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {selectedTransactions.length > 0 && (
            <Button
              variant="destructive"
              className="gap-2 w-fit bg-red-500 hover:bg-red-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedTransactions.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 w-fit border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                disabled={filteredTransactions.length === 0}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Export Options
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleExportCSV}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="text-[10px] font-bold">CSV</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as CSV</p>
                  <p className="text-[10px] text-gray-500">For spreadsheets</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportPDF}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="text-[10px] font-bold">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as PDF</p>
                  <p className="text-[10px] text-gray-500">For printing</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Delete Transactions
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={singleDeleteOpen} onOpenChange={setSingleDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Delete Transaction
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{singleDeleteTarget?.description}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSingleDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleSingleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Transaction Dialog */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-emerald-500" />
              Update Transaction
            </DialogTitle>
            <DialogDescription>
              Edit the details of this transaction and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Description</label>
              <input
                type="text"
                value={updateForm.description}
                onChange={(e) => setUpdateForm((p) => ({ ...p, description: e.target.value }))}
                className={cn(
                  'w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all dark:bg-gray-800 dark:text-gray-100',
                  updateErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500'
                )}
                placeholder="Enter description"
              />
              {updateErrors.description && <p className="text-red-500 text-base mt-1">{updateErrors.description}</p>}
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={updateForm.amount}
                    onChange={(e) => setUpdateForm((p) => ({ ...p, amount: e.target.value }))}
                    className={cn(
                      'w-full h-11 pl-9 pr-4 border rounded-lg focus:outline-none focus:ring-2 transition-all dark:bg-gray-800 dark:text-gray-100',
                      updateErrors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500'
                    )}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {updateErrors.amount && <p className="text-red-500 text-base mt-1">{updateErrors.amount}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={updateForm.date}
                  onChange={(e) => setUpdateForm((p) => ({ ...p, date: e.target.value }))}
                  className={cn(
                    'w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all dark:bg-gray-800 dark:text-gray-100',
                    updateErrors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500'
                  )}
                />
                {updateErrors.date && <p className="text-red-500 text-base mt-1">{updateErrors.date}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Category</label>
              <SelectBox
                value={updateForm.category}
                onChange={(val) => setUpdateForm((p) => ({ ...p, category: val }))}
                options={categoryOptions}
                placeholder="Select category"
                error={updateErrors.category}
                dropdownPosition="top"
              />
              {updateErrors.category && <p className="text-red-500 text-base mt-1">{updateErrors.category}</p>}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Payment Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setUpdateForm((p) => ({ ...p, paymentMode: mode.id }))}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all',
                      updateForm.paymentMode === mode.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {updateForm.paymentMode === mode.id && <Check className="w-3.5 h-3.5" />}
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleUpdateSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
                dateFilter !== 'all' ? "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              )}>
                <span className="capitalize">{dateFilter === 'all' ? 'Date Range' : dateFilter.replace('_', ' ')}</span>
                <Calendar className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuRadioGroup value={dateFilter} onValueChange={(val) => { setDateFilter(val); setCurrentPage(1); }}>
                <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="month">This Month</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
                categoryFilter !== 'all' ? "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              )}>
                <span className="truncate max-w-[100px]">{categoryFilter === 'all' ? 'Category' : categoryFilter}</span>
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}>
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {expenseCategories.map(cat => (
                  <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                ))}
                <DropdownMenuSeparator />
                {incomeCategories.map(cat => (
                  <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
                typeFilter !== 'all' ? "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              )}>
                <span className="capitalize">{typeFilter === 'all' ? 'Type' : typeFilter}</span>
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
                <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="income">Income</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="expense">Expense</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {(typeFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || searchQuery !== '') && (
              <button 
              onClick={() => {
                setTypeFilter('all');
                setCategoryFilter('all');
                setDateFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-base text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm ml-auto">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Export Options
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleExportCSV}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="text-[10px] font-bold">CSV</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as CSV</p>
                  <p className="text-[10px] text-gray-500">For spreadsheets</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportPDF}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="text-[10px] font-bold">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as PDF</p>
                  <p className="text-[10px] text-gray-500">For printing</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="px-4 py-4 text-left">
                  <Checkbox
                    checked={
                      selectedTransactions.length === currentTransactions.length &&
                      currentTransactions.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">Description</th>
                <th className="px-4 py-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-4 py-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-4 py-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">Amount</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                currentTransactions.map((transaction) => {
                  const iconName = categoryIconMap[transaction.category] || transaction.icon || 'shopping-cart';
                  const Icon = iconMap[iconName] || ShoppingCart;
                  const isIncome = transaction.type === 'income';

                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedTransactions.includes(transaction._id)}
                          onCheckedChange={() => toggleSelection(transaction._id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                              categoryColors[transaction.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                            <p className="text-base text-gray-500 dark:text-gray-400">
                              {transaction.paymentMode === 'credit_card'
                                ? `Credit Card ••${transaction.cardLast4 || 'XXXX'}`
                                : transaction.paymentMode === 'debit_card'
                                ? `Debit Card ••${transaction.cardLast4 || 'XXXX'}`
                                : transaction.paymentMode === 'bank_transfer'
                                ? 'Bank Transfer'
                                : transaction.paymentMode === 'upi'
                                ? 'UPI / Digital'
                                : 'Cash'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium',
                            categoryColors[transaction.category] || 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-base text-gray-600 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={transaction.status || 'completed'} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={cn('font-medium', isIncome ? 'text-emerald-500' : 'text-red-500')}>
                          {isIncome ? '+' : '-'}₹{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors outline-none">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openUpdate(transaction)} className="gap-2 cursor-pointer">
                              <Pencil className="w-4 h-4" />
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openSingleDelete(transaction)}
                              variant="destructive"
                              className="gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-base text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstTransaction + 1}-
            {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 dark:text-gray-400" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-lg text-base font-medium transition-colors',
                  currentPage === i + 1
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Button component for the page
function Button({ children, variant = 'default', className, ...props }) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200',
        variant === 'outline'
          ? 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          : variant === 'destructive'
          ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20'
          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

