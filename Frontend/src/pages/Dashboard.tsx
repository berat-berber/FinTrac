function Dashboard() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#2a2a2a' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8" style={{ color: '#e0f2e0' }}>Dashboard</h1>
        
        {/* Top boxes */}
        <div className="mb-8" style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
          <div className="rounded-xl p-6 shadow-lg" style={{ flex: 1, backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Name</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Balance</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Currency</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-6 shadow-lg" style={{ flex: 1, backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Name</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Balance</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Currency</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-6 shadow-lg" style={{ flex: 1, backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Name</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Balance</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#a8e6a8' }}>Currency</p>
                <p className="text-lg font-semibold" style={{ color: '#e0f2e0' }}>-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large list box */}
        <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#3a3a3a', border: '1px solid #4a4a4a' }}>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#e0f2e0' }}>Items List</h2>
          <div className="space-y-3">
            {/* Placeholder list items */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <p className="text-sm" style={{ color: '#e0f2e0' }}>Item 1</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <p className="text-sm" style={{ color: '#e0f2e0' }}>Item 2</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a' }}>
              <p className="text-sm" style={{ color: '#e0f2e0' }}>Item 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

