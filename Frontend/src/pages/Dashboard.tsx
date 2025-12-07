import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

interface Account {
  category: string;
  currency: string;
  accountName: string;
  accountId: string;
}

interface Transaction {
  accountId: string;
  amount: number;
  balance: number;
  dateTime: string;
  description: string;
}

interface AccountWithBalance extends Account {
  balance: number | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountWithBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch accounts
        const accountsResponse = await fetchWithAuth('/Accounts', {
          method: 'GET',
        });

        if (!accountsResponse.ok) {
          setError('Failed to load accounts');
          return;
        }

        const accountsData = await accountsResponse.json();
        const accountsArray: Account[] = Array.isArray(accountsData) ? accountsData : [accountsData];

        // Fetch transactions
        const transactionsResponse = await fetchWithAuth('/Transactions', {
          method: 'GET',
        });

        if (!transactionsResponse.ok) {
          setError('Failed to load transactions');
          return;
        }

        const transactionsData = await transactionsResponse.json();
        const transactionsArray: Transaction[] = Array.isArray(transactionsData) ? transactionsData : [];

        // Store transactions for display
        setTransactions(transactionsArray);

        // Match accounts with their latest transaction balance
        const accountsWithBalance: AccountWithBalance[] = accountsArray.map(account => {
          // Find transactions for this account
          const accountTransactions = transactionsArray.filter(
            transaction => transaction.accountId === account.accountId
          );

          // Get balance from the first (most recent) transaction
          const balance = accountTransactions.length > 0 ? accountTransactions[0].balance : null;

          return {
            ...account,
            balance,
          };
        });

        setAccounts(accountsWithBalance);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          return; // Already redirecting to login
        }
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#2a2a2a' }}>
        <p style={{ color: '#e0f2e0' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold" style={{ color: '#e0f2e0' }}>Dashboard</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/account')}
              className="px-4 py-2 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors"
              style={{ 
                backgroundColor: '#a8e6a8',
                color: '#1a1a1a'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b8f6b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#a8e6a8';
              }}
            >
              Add Account
            </button>
            <button
              onClick={() => navigate('/deleteAccount')}
              className="px-4 py-2 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors"
              style={{ 
                backgroundColor: '#ff6b6b',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ff5252';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff6b6b';
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#ff6b6b', color: '#ffffff' }}>
            {error}
          </div>
        )}

        {/* Account boxes */}
        {accounts.length === 0 ? (
          <div className="text-center" style={{ color: '#e0f2e0' }}>
            <p className="mb-4">You have no accounts yet.</p>
            <p className="text-sm" style={{ color: '#a8e6a8' }}>Create an account to get started.</p>
          </div>
        ) : (
          <div className="mb-8" style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
            {accounts.map((account) => (
              <div 
                key={account.accountId}
                className="rounded-xl p-6 shadow-lg" 
                style={{ backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a', minWidth: '200px', flex: '0 0 auto' }}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Name</p>
                    <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>
                      {account.accountName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Balance</p>
                    <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>
                      {account.balance !== null ? account.balance.toFixed(2) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Currency</p>
                    <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>
                      {account.currency}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions List */}
        <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#e0f2e0' }}>Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-center" style={{ color: '#e0f2e0' }}>No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #4a4a4a' }}>
                    <th className="text-left p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Account Name</th>
                    <th className="text-left p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Date</th>
                    <th className="text-left p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Description</th>
                    <th className="text-right p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Amount</th>
                    <th className="text-right p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const account = accounts.find(acc => acc.accountId === transaction.accountId);
                    return (
                      <tr 
                        key={`${transaction.accountId}-${index}`}
                        style={{ borderBottom: '1px solid #4a4a4a' }}
                      >
                        <td className="p-3 text-sm" style={{ color: '#e0f2e0' }}>
                          {account ? account.accountName : '-'}
                        </td>
                        <td className="p-3 text-sm" style={{ color: '#e0f2e0' }}>
                          {new Date(transaction.dateTime).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm" style={{ color: '#e0f2e0' }}>
                          {transaction.description}
                        </td>
                        <td 
                          className="p-3 text-sm text-right font-semibold" 
                          style={{ color: transaction.amount >= 0 ? '#a8e6a8' : '#ff6b6b' }}
                        >
                          {transaction.amount.toFixed(2)}
                        </td>
                        <td className="p-3 text-sm text-right font-semibold" style={{ color: '#e0f2e0' }}>
                          {transaction.balance.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;