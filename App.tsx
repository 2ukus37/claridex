import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { RestaurantDashboard } from './components/RestaurantDashboard';

export type UserRole = 'customer' | 'driver' | 'restaurant';
export type ServiceType = 'ride' | 'food';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  rating?: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'customer' && <CustomerDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'driver' && <DriverDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'restaurant' && <RestaurantDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
};

export default App;
