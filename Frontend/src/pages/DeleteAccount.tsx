import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

interface Account {
  category: string;
  currency: string;
  accountName: string;
  accountId: string;
}

function DeleteAccount() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

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
        const accountsArray = Array.isArray(data) ? data : [data];
        setAccounts(accountsArray);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          return;
        }
        setError('Failed to load accounts');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleDeleteClick = () => {
    if (!selectedAccountId) {
      setError('Please select an account');
      return;
    }
    setShowWarning(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/Accounts/${selectedAccountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        setError('Failed to delete account');
        return;
      }

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowWarning(false);
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
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Delete Account</h1>
        
        {accounts.length === 0 ? (
          <div className="text-center" style={{ color: '#e0f2e0' }}>
            <p className="mb-4">You have no accounts to delete.</p>
          </div>
        ) : (
          <>
            {!showWarning ? (
              <div className="flex flex-col gap-8 items-center">
                {/* Account Selection Dropdown */}
                <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
                  <div className="flex flex-col gap-3">
                    <label htmlFor="accountSelect" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Select Account</label>
                    <select
                      id="accountSelect"
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
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
                        <option key={account.accountId} value={account.accountId}>
                          {account.accountName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="p-3 border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#ff6b6b',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#ff5252';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#ff6b6b';
                    }
                  }}
                >
                  Delete Account
                </button>

                {error && (
                  <div className="text-sm mt-2 text-center" style={{ color: '#ff6b6b', maxWidth: '300px' }}>
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                {/* Warning Message */}
                <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a2a', border: '2px solid #ff6b6b' }}>
                  <p className="text-center text-base" style={{ color: '#e0f2e0' }}>
                    Are you sure you want to delete this account?
                  </p>
                  <p className="text-center text-sm mt-2" style={{ color: '#ff6b6b' }}>
                    All transactions linked to this account will also be deleted.
                  </p>
                </div>

                {/* Confirmation Buttons */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="px-6 py-3 border-none rounded-md text-base font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#4a4a4a',
                      color: '#e0f2e0'
                    }}
                    onMouseEnter={(e) => {
                      if (!isDeleting) {
                        e.currentTarget.style.backgroundColor = '#5a5a5a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDeleting) {
                        e.currentTarget.style.backgroundColor = '#4a4a4a';
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-6 py-3 border-none rounded-md text-base font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#ff6b6b',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      if (!isDeleting) {
                        e.currentTarget.style.backgroundColor = '#ff5252';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDeleting) {
                        e.currentTarget.style.backgroundColor = '#ff6b6b';
                      }
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>

                {error && (
                  <div className="text-sm mt-2 text-center" style={{ color: '#ff6b6b', maxWidth: '300px' }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteAccount;