'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface Props {
  onSuccess: () => void;
}

export default function AddTransactionForm({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    type: 'income',
    recurrenceDay: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/transactions', {
        description: form.description,
        amount: Number(form.amount),
        date: form.date,
        type: form.type,
        ...(form.type === 'fixed-expense' && form.recurrenceDay
          ? { recurrenceDay: Number(form.recurrenceDay) }
          : {}),
      });
      setForm({ description: '', amount: '', date: '', type: 'income', recurrenceDay: '' });
      setOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
      >
        + Nova Transação
      </button>

      {open && (
        <div className="mt-4 bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="number"
              placeholder="Valor"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="px-4 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              required
              min="0.01"
              step="0.01"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-4 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
              <option value="fixed-expense">Despesa Fixa</option>
            </select>

            {form.type === 'fixed-expense' ? (
              <input
                type="number"
                placeholder="Dia de recorrência (ex: 5)"
                value={form.recurrenceDay}
                onChange={(e) => setForm({ ...form, recurrenceDay: e.target.value })}
                className="px-4 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                min="1"
                max="31"
              />
            ) : (
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="px-4 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-white focus:outline-none focus:border-emerald-500"
                required
              />
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}