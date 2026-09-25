import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../config/constants.js';

const AdminPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [registrationFee, setRegistrationFee] = useState(970);

  const fetchRegistrations = async (key) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/registration`, {
        headers: { 'x-api-key': key.replace(/\s/g, '') }
      });
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data.data || []);
      if (data.financials?.registrationFee) {
        setRegistrationFee(data.financials.registrationFee);
      }
    } catch (err) {
      setError('Failed to fetch registrations. Please check your API key.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter an API key'); return; }
    setLoading(true);
    setError('');
    try {
      const cleanKey = apiKey.replace(/\s/g, '');
      await fetchRegistrations(cleanKey);
      localStorage.setItem('munc_admin_api_key', cleanKey);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
      localStorage.removeItem('munc_admin_api_key');
      setError('Invalid API key or authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmMomoPayment = async (registrationCode) => {
    try {
      setConfirmingId(registrationCode);
      const response = await fetch(`${API_BASE_URL}/registration/confirm-momo/${registrationCode}`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey.replace(/\s/g, ''), 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to confirm payment');
      const data = await response.json();
      if (data.status === 'success') {
        setError('');
        await fetchRegistrations(apiKey);
      } else {
        setError(data.message || 'Failed to confirm payment');
      }
    } catch (err) {
      setError('Error confirming payment: ' + err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  const deleteRegistration = async (id, name) => {
    if (!window.confirm(`Delete registration for ${name}? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      const response = await fetch(`${API_BASE_URL}/registration/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey.replace(/\s/g, '') }
      });
      if (!response.ok) throw new Error('Failed to delete');
      const data = await response.json();
      if (data.status === 'success') {
        setRegistrations(prev => prev.filter(r => r.id !== id));
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Error deleting registration: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('munc_admin_api_key');
    setIsAuthenticated(false);
    setApiKey('');
    setRegistrations([]);
  };

  const exportExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/export/excel`, {
        headers: { 'x-api-key': apiKey.replace(/\s/g, '') }
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `munc-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError('Failed to export Excel file');
    }
  };

  const availableYears = useMemo(() => {
    const years = [...new Set(registrations.map(r => new Date(r.created_at).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [registrations]);

  const yearFiltered = useMemo(() => {
    if (selectedYear === 'all') return registrations;
    return registrations.filter(r => new Date(r.created_at).getFullYear() === Number(selectedYear));
  }, [registrations, selectedYear]);

  const tabCounts = useMemo(() => {
    const all = yearFiltered;
    return {
      all: all.length,
      paid: all.filter(r => r.payment_status === 'paid').length,
      pending: all.filter(r => r.payment_status === 'pending').length,
      momoVerify: all.filter(r => r.payment_status === 'pending_verification').length,
    };
  }, [yearFiltered]);

  const stats = useMemo(() => {
    const data = yearFiltered;
    const total = data.length;
    const paid = data.filter(r => r.payment_status === 'paid').length;
    const pending = data.filter(r => r.payment_status === 'pending').length;
    const momoVerify = data.filter(r => r.payment_status === 'pending_verification').length;
    const totalExpected = total * registrationFee;
    const totalCollected = data
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (Number(r.Payments?.[0]?.amount) || registrationFee), 0);
    return { total, paid, pending, momoVerify, totalExpected, totalCollected, outstanding: totalExpected - totalCollected };
  }, [yearFiltered, registrationFee]);

  const filteredRegistrations = useMemo(() => {
    let data = yearFiltered;
    if (activeTab === 'paid') data = data.filter(r => r.payment_status === 'paid');
    else if (activeTab === 'pending') data = data.filter(r => r.payment_status === 'pending');
    else if (activeTab === 'momo') data = data.filter(r => r.payment_status === 'pending_verification');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        r.first_name?.toLowerCase().includes(q) ||
        r.surname?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone_number?.includes(q) ||
        r.registration_code?.toLowerCase().includes(q) ||
        r.institution?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [yearFiltered, activeTab, searchQuery]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  // ─── Login Screen ────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 mb-4">
              <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">MUNC-GLOBAL Registration System</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition text-sm"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900">MUNC-GLOBAL</h1>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export
            </button>
            <button
              onClick={() => fetchRegistrations(apiKey)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              selectedYear === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Years
          </button>
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(String(year))}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                selectedYear === String(year) ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Registrations</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            <div className="flex gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{stats.paid} paid</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>{stats.pending} pending</span>
              {stats.momoVerify > 0 && (
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>{stats.momoVerify} verifying</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Expected Revenue</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              <span className="text-lg font-medium text-slate-400">GH₵</span>{formatCurrency(stats.totalExpected)}
            </p>
            <p className="text-xs text-slate-400 mt-3">{stats.total} × GH₵{formatCurrency(registrationFee)}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Collected</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              <span className="text-lg font-medium text-emerald-400">GH₵</span>{formatCurrency(stats.totalCollected)}
            </p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalExpected ? (stats.totalCollected / stats.totalExpected) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Outstanding</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              <span className="text-lg font-medium text-amber-400">GH₵</span>{formatCurrency(stats.outstanding)}
            </p>
            <p className="text-xs text-slate-400 mt-3">{stats.pending + stats.momoVerify} unpaid registrations</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { key: 'all', label: 'All', count: tabCounts.all },
                { key: 'paid', label: 'Paid', count: tabCounts.paid },
                { key: 'pending', label: 'Pending', count: tabCounts.pending },
                { key: 'momo', label: 'MoMo Verify', count: tabCounts.momoVerify },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 ${activeTab === tab.key ? 'text-slate-400' : 'text-slate-400'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-2 border-slate-200 border-t-teal-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-500">Loading registrations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="w-[3%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                    <th className="w-[15%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                    <th className="w-[16%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                    <th className="w-[8%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Phone</th>
                    <th className="w-[14%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Institution</th>
                    <th className="w-[9%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="w-[7%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                    <th className="w-[12%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Emergency</th>
                    <th className="w-[7%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                    <th className="w-[9%] px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-2 py-12 text-center text-slate-400">
                        No registrations found{searchQuery ? ` for "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg, i) => (
                      <tr key={reg.id || i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-2 py-2.5 text-slate-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-2 py-2.5">
                          <p className="font-medium text-slate-900 text-xs truncate">{reg.first_name} {reg.surname}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{reg.registration_code}</p>
                        </td>
                        <td className="px-2 py-2.5 text-slate-600 text-xs truncate">{reg.email}</td>
                        <td className="px-2 py-2.5 text-slate-600 text-xs">{reg.phone_number}</td>
                        <td className="px-2 py-2.5 text-slate-600 text-xs truncate">{reg.institution}</td>
                        <td className="px-2 py-2.5">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            reg.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : reg.payment_status === 'pending_verification'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {reg.payment_status === 'pending_verification' ? 'Verifying' : reg.payment_status}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-slate-600 text-xs font-mono">
                          {(reg.Payments?.[0]?.amount || reg.payment_status === 'paid')
                            ? `₵${formatCurrency(reg.Payments?.[0]?.amount || registrationFee)}`
                            : '—'
                          }
                        </td>
                        <td className="px-2 py-2.5">
                          {reg.emergency_contact_name ? (
                            <>
                              <p className="text-slate-700 text-xs truncate">{reg.emergency_contact_name}</p>
                              <p className="text-slate-400 text-[10px] truncate">{reg.emergency_contact_number}</p>
                            </>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-slate-500 text-xs">{formatDate(reg.created_at)}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1">
                            {activeTab === 'momo' && (
                              <button
                                onClick={() => confirmMomoPayment(reg.registration_code)}
                                disabled={confirmingId === reg.registration_code}
                                className="inline-flex items-center px-2 py-1 text-[10px] font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              >
                                {confirmingId === reg.registration_code ? '...' : 'Confirm'}
                              </button>
                            )}
                            <button
                              onClick={() => deleteRegistration(reg.id, `${reg.first_name} ${reg.surname}`)}
                              disabled={deletingId === reg.id}
                              className="inline-flex items-center px-2 py-1 text-[10px] font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {deletingId === reg.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {filteredRegistrations.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                  Showing {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''}
                  {selectedYear !== 'all' ? ` from ${selectedYear}` : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
