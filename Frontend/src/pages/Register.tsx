import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await fetch('http://localhost:5134/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if the response has the errors array structure
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: { description: string }) => err.description);
          setErrors(errorMessages);
        } else if (typeof errorData === 'string') {
          // Handle simple string error messages
          setErrors([errorData]);
        } else {
          setErrors(['Registration failed']);
        }
        return;
      }

      // Registration successful
      console.log('Registration successful');
      // TODO: Handle successful registration (e.g., redirect to login)
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'An error occurred during registration']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="rounded-xl p-10 w-full max-w-md shadow-lg" style={{ backgroundColor: '#3a3a3a' }}>
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center">
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
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
          <div className="rounded-lg p-5 w-fit" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <label htmlFor="password" className="text-sm font-medium w-fit" style={{ color: '#e0f2e0' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          {errors.length > 0 && (
            <div className="flex flex-col gap-2 mt-2" style={{ maxWidth: '300px' }}>
              {errors.map((error, index) => (
                <div key={index} className="text-sm text-center" style={{ color: '#ff6b6b' }}>
                  {error}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center items-center gap-2 mt-5 text-sm" style={{ color: '#e0f2e0' }}>
            <span>Already have an account?</span>
            <Link 
              to="/login" 
              className="no-underline font-semibold transition-colors hover:underline"
              style={{ color: '#a8e6a8' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#b8f6b8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a8e6a8'}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

