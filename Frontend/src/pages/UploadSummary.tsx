import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

interface Account {
  category: string;
  currency: string;
  accountName: string;
  accountId: string;
}

interface Transaction {
  tempId: string;
  amount: number;
  balance: number;
  dateTime: string;
  desc: string;
  order: number;
}

function UploadSummary() {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetchWithAuth('/Accounts', {
          method: 'GET',
        });

        if (!response.ok) {
          setError('Failed to load accounts');
          return;
        }

        const data = await response.json();
        // If data is a single object, wrap it in an array
        const accountsArray = Array.isArray(data) ? data : [data];
        setAccounts(accountsArray);
        console.log('Loaded accounts:', accountsArray);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          return; // Already redirecting to login
        }
        setError('Failed to load accounts');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Starting upload...');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('BankName', bankName);
      formData.append('AccountName', accountName);
      if (file) {
        formData.append('File', file);
      }

      console.log('Sending request to API...');

      const response = await fetch('http://localhost:5134/api/Summaries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Received response, status:', response.status);

      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        setError('Failed to upload summary');
        return;
      }

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        setError('Invalid response from server');
        return;
      }
      
      const transactionsArray = Array.isArray(data) ? data : [data];
      console.log('Parsed transactions:', transactionsArray);
      setTransactions(transactionsArray);
      console.log('Transactions state updated, length:', transactionsArray.length);
      
      // Clear form
      setBankName('');
      setAccountName('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      console.error('Error during upload:', err);
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      console.log('Upload process finished');
      setIsLoading(false);
    }
  };

  if (isLoadingAccounts) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#2a2a2a' }}>
        <p style={{ color: '#e0f2e0' }}>Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="rounded-xl p-10 w-full max-w-md shadow-lg" style={{ backgroundColor: '#3a3a3a' }}>
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Upload Summary</h1>
        
        {accounts.length === 0 ? (
          <div className="text-center" style={{ color: '#e0f2e0' }}>
            <p className="mb-4">You have no accounts yet.</p>
            <p className="text-sm" style={{ color: '#a8e6a8' }}>Please create an account first to upload summaries.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center">
            {/* Bank Name Dropdown */}
            <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <div className="flex flex-col gap-3">
                <label htmlFor="bankName" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Bank Name</label>
                <select
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  className="p-4 rounded-xl text-base transition-all focus:outline-none cursor-pointer"
                  style={{ 
                    width: '300px',
                    border: '2px solid #4a4a4a',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontSize: '16px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a8e6a8';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(168, 230, 168, 0.15), 0 4px 12px rgba(168, 230, 168, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a4a4a';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLSelectElement;
                    if (document.activeElement !== target) {
                      target.style.borderColor = '#5a5a5a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLSelectElement;
                    if (document.activeElement !== target) {
                      target.style.borderColor = '#4a4a4a';
                    }
                  }}
                >
                  <option value="">Select a bank</option>
                  <option value="Is Bank">Is Bank</option>
                  <option value="Ziraat Bank">Ziraat Bank</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <div className="flex flex-col gap-3">
                <label htmlFor="file" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>File Upload</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  required
                  className="p-4 rounded-xl text-base transition-all focus:outline-none cursor-pointer"
                  style={{ 
                    width: '300px',
                    border: '2px solid #4a4a4a',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontSize: '16px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a8e6a8';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(168, 230, 168, 0.15), 0 4px 12px rgba(168, 230, 168, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a4a4a';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
                {file && (
                  <p className="text-xs" style={{ color: '#a8e6a8' }}>
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Account Name Dropdown */}
            <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <div className="flex flex-col gap-3">
                <label htmlFor="accountName" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Account Name</label>
                <select
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="p-4 rounded-xl text-base transition-all focus:outline-none cursor-pointer"
                  style={{ 
                    width: '300px',
                    border: '2px solid #4a4a4a',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontSize: '16px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a8e6a8';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(168, 230, 168, 0.15), 0 4px 12px rgba(168, 230, 168, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a4a4a';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLSelectElement;
                    if (document.activeElement !== target) {
                      target.style.borderColor = '#5a5a5a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLSelectElement;
                    if (document.activeElement !== target) {
                      target.style.borderColor = '#4a4a4a';
                    }
                  }}
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.accountId} value={account.accountName}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="p-3 border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#a8e6a8',
                color: '#1a1a1a'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#b8f6b8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#a8e6a8';
                }
              }}
              onMouseDown={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#98d698';
                }
              }}
              onMouseUp={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#b8f6b8';
                }
              }}
            >
              {isLoading ? 'Uploading...' : 'Upload Summary'}
            </button>
            {error && (
              <div className="text-sm mt-2 text-center" style={{ color: '#ff6b6b', maxWidth: '300px' }}>
                {error}
              </div>
            )}
          </form>
        )}

        {/* Transactions List */}
        {transactions.length > 0 && (
          <div className="mt-8 rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#e0f2e0' }}>Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #4a4a4a' }}>
                    <th className="text-left p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Date</th>
                    <th className="text-left p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Description</th>
                    <th className="text-right p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Amount</th>
                    <th className="text-right p-3 text-sm font-medium" style={{ color: '#a8e6a8' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction.tempId}
                      style={{ borderBottom: '1px solid #4a4a4a' }}
                    >
                      <td className="p-3 text-sm" style={{ color: '#e0f2e0' }}>
                        {new Date(transaction.dateTime).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm" style={{ color: '#e0f2e0' }}>
                        {transaction.desc}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadSummary;