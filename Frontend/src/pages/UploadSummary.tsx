import { useState } from 'react';

function UploadSummary() {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Add API call to upload summary
      console.log('Uploading summary:', { bankName, accountName, file });
      
      // Placeholder for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Handle successful upload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="rounded-xl p-10 w-full max-w-md shadow-lg" style={{ backgroundColor: '#3a3a3a' }}>
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Upload Summary</h1>
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

          {/* Account Name Input */}
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="accountName" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Account Name</label>
              <input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
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
      </div>
    </div>
  );
}

export default UploadSummary;