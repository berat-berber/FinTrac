import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [accountCategory, setAccountCategory] = useState('Checking');
  const [currency, setCurrency] = useState('₺');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from name
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Account name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(API_URL + '/api/Accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          accountCategory: accountCategory,
          currency: currency,
        }),
      });

      if (response.status === 401) {
        setError('Unauthorized. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to create account');
        return;
      }

      // Success - redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="rounded-xl p-10 w-full max-w-md shadow-lg" style={{ backgroundColor: '#3a3a3a' }}>
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center">
          {/* Name Input */}
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="name" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter account name"
                className="p-4 rounded-xl text-base transition-all focus:outline-none"
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
                  const target = e.target as HTMLInputElement;
                  if (document.activeElement !== target) {
                    target.style.borderColor = '#5a5a5a';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (document.activeElement !== target) {
                    target.style.borderColor = '#4a4a4a';
                  }
                }}
              />
            </div>
          </div>

          {/* Account Category Dropdown */}
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="category" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Account Category</label>
              <select
                id="category"
                value={accountCategory}
                onChange={(e) => setAccountCategory(e.target.value)}
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
                <option value="Checking">Checking</option>
              </select>
            </div>
          </div>

          {/* Currency Dropdown */}
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="currency" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
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
                <option value="₺">₺</option>
                <option value="$">$</option>
                <option value="€">€</option>
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
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
          {error && (
            <div className="text-sm mt-2 text-center" style={{ color: '#ff6b6b', maxWidth: '300px' }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;