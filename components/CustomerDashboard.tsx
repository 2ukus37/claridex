import React, { useState } from 'react';
import { User, ServiceType } from '../App';
import { RideBooking } from './RideBooking';
import { FoodDelivery } from './FoodDelivery';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  const [activeService, setActiveService] = useState<ServiceType>('ride');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">TAKCI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Service Tabs */}
      <div className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveService('ride')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                activeService === 'ride'
                  ? 'text-black border-b-4 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🚗</span>
                <span>Ride</span>
              </div>
            </button>
            <button
              onClick={() => setActiveService('food')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                activeService === 'food'
                  ? 'text-black border-b-4 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🍔</span>
                <span>Food</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {activeService === 'ride' && <RideBooking user={user} />}
        {activeService === 'food' && <FoodDelivery user={user} />}
      </main>
    </div>
  );
};
