'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { Transaction, Balance } from '@/types';
import api from '@/lib/api';
import TransactionForm from '@/components/TransactionForm';

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, balRes] = await Promise.all([
        api.get(`/transactions?month=${month}&year=${year}`),
        api.get(`/balance?month=${month}&year=${year}`),
      ]);
      setTransactions(txRes.data);
      setBalance(balRes.data);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir essa transação?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch {
      alert('Erro ao excluir transação');
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return (
    <main className="min-h-screen bg-[#0f1117] text-white">
      <header className="bg-[#1a1d27] border-b border-[#2a2d3a] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Gestão Financeira</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Sair
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
        {/* Filtro de mês/ano */}
        <div className="flex gap-4 items-center">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3a] text-white focus:outline-none focus:border-emerald-500"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3a] text-white focus:outline-none focus:border-emerald-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Formulário de nova transação ou edição */}
        {editingTransaction ? (
          <TransactionForm
            onSuccess={() => { setEditingTransaction(null); fetchData(); }}
            editData={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        ) : (
          <TransactionForm onSuccess={fetchData} />
        )}

        {/* Cards de saldo */}
        {balance && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Receitas</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(balance.income)}</p>
            </div>
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(balance.expense)}</p>
            </div>
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Saldo</p>
              <p className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(balance.balance)}
              </p>
            </div>
          </div>
        )}

        {/* Listagem */}
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Transações</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Carregando...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma transação encontrada</p>
          ) : (
            <div className="flex flex-col gap-2">
              {transactions.map((t) => (
                <div key={t._id} className="flex justify-between items-center p-4 rounded-xl bg-[#0f1117] border border-[#2a2d3a]">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-400">
                      {t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'Despesa Fixa'}
                      {t.recurrenceDay ? ` · Todo dia ${t.recurrenceDay}` : ` · ${new Date(t.date).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    <button
                      onClick={() => setEditingTransaction(t)}
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}