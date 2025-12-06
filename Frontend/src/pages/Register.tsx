import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement register API call
    console.log('Register:', { email, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="rounded-xl p-10 w-full max-w-md shadow-lg" style={{ backgroundColor: '#3a3a3a' }}>
        <h1 className="text-center mb-8 text-3xl font-semibold" style={{ color: '#e0f2e0' }}>Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium mb-1" style={{ color: '#e0f2e0' }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="p-4 rounded-lg text-base transition-all focus:outline-none"
              style={{ 
                border: '1px solid #4a4a4a',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                fontSize: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a8e6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(168, 230, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#4a4a4a';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium mb-1" style={{ color: '#e0f2e0' }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="p-4 rounded-lg text-base transition-all focus:outline-none"
              style={{ 
                border: '1px solid #4a4a4a',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                fontSize: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a8e6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(168, 230, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#4a4a4a';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>
          <button 
            type="submit" 
            className="p-3 border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-2"
            style={{ 
              backgroundColor: '#a8e6a8',
              color: '#1a1a1a'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8f6b8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a8e6a8'}
            onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#98d698'}
            onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#b8f6b8'}
          >
            Register
          </button>
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

