import React, { useState } from 'react';
import { User } from '../App';

interface DriverDashboardProps {
  user: User;
  onLogout: () => void;
}

interface RideRequest {
  id: string;
  passenger: {
    name: string;
    rating: number;
  };
  pickup: string;
  dropoff: string;
  distance: string;
  fare: number;
  type: 'ride' | 'food';
}

interface ActiveJob {
  id: string;
  type: 'ride' | 'food';
  customer: {
    name: string;
    rating: number;
    phone: string;
  };
  pickup: string;
  dropoff: string;
  fare: number;
  status: 'going-to-pickup' | 'at-pickup' | 'in-progress' | 'completed';
  restaurant?: string;
  orderDetails?: string;
}

const mockRequests: RideRequest[] = [
  {
    id: '1',
    passenger: { name: 'Sarah Johnson', rating: 4.9 },
    pickup: '123 Main St',
    dropoff: 'Central Park',
    distance: '2.5 mi',
    fare: 15.50,
    type: 'ride',
  },
  {
    id: '2',
    passenger: { name: 'Mike Chen', rating: 5.0 },
    pickup: 'Pizza Heaven',
    dropoff: '456 Oak Avenue',
    distance: '1.8 mi',
    fare: 8.50,
    type: 'food',
  },
  {
    id: '3',
    passenger: { name: 'Emily Davis', rating: 4.7 },
    pickup: 'Airport Terminal 2',
    dropoff: 'Downtown Hotel',
    distance: '12.3 mi',
    fare: 45.00,
    type: 'ride',
  },
];

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState<RideRequest[]>(mockRequests);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [earnings, setEarnings] = useState({
    today: 127.50,
    week: 856.75,
    trips: 23,
  });

  const handleAcceptRequest = (request: RideRequest) => {
    const job: ActiveJob = {
      id: request.id,
      type: request.type,
      customer: {
        name: request.passenger.name,
        rating: request.passenger.rating,
        phone: '+1 (555) 123-4567',
      },
      pickup: request.pickup,
      dropoff: request.dropoff,
      fare: request.fare,
      status: 'going-to-pickup',
      restaurant: request.type === 'food' ? request.pickup : undefined,
      orderDetails: request.type === 'food' ? '2x Burger, 1x Fries, 1x Drink' : undefined,
    };
    setActiveJob(job);
    setRequests(requests.filter(r => r.id !== request.id));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleCompleteJob = () => {
    if (activeJob) {
      setEarnings({
        ...earnings,
        today: earnings.today + activeJob.fare,
        trips: earnings.trips + 1,
      });
    }
    setActiveJob(null);
  };

  if (activeJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black text-white p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Active {activeJob.type === 'ride' ? 'Ride' : 'Delivery'}</h1>
            <div className="text-right">
              <p className="text-2xl font-bold">${activeJob.fare.toFixed(2)}</p>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
            </div>
            <div className="text-center z-10">
              <div className="text-6xl mb-4 animate-bounce">🗺️</div>
              <p className="text-xl font-bold text-gray-800">Navigation Active</p>
              <p className="text-gray-600">Follow the route</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{activeJob.customer.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <span>⭐ {activeJob.customer.rating}</span>
                  <span>•</span>
                  <span>📞 {activeJob.customer.phone}</span>
                </div>
              </div>
              <div className="text-4xl">
                {activeJob.type === 'ride' ? '👤' : '🍔'}
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-6">
              <div className={`flex items-center space-x-4 ${activeJob.status === 'going-to-pickup' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeJob.status === 'going-to-pickup' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                }`}>
                  <span className="text-xl">🚗</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Going to pickup</p>
                  <p className="text-sm text-gray-600">{activeJob.pickup}</p>
                </div>
              </div>

              <div className={`flex items-center space-x-4 ${activeJob.status === 'at-pickup' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeJob.status === 'at-pickup' ? 'bg-yellow-500 animate-pulse' : activeJob.status === 'in-progress' || activeJob.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className="text-xl">📍</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">At pickup location</p>
                  <p className="text-sm text-gray-600">
                    {activeJob.type === 'ride' ? 'Waiting for passenger' : 'Collect order'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-4 ${activeJob.status === 'in-progress' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeJob.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : activeJob.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className="text-xl">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Going to destination</p>
                  <p className="text-sm text-gray-600">{activeJob.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Order Details for Food Delivery */}
            {activeJob.type === 'food' && activeJob.orderDetails && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-semibold mb-2">Order Details:</p>
                <p className="text-sm text-gray-700">{activeJob.orderDetails}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {activeJob.status === 'going-to-pickup' && (
                <button
                  onClick={() => setActiveJob({ ...activeJob, status: 'at-pickup' })}
                  className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800"
                >
                  Arrived at Pickup
                </button>
              )}
              {activeJob.status === 'at-pickup' && (
                <button
                  onClick={() => setActiveJob({ ...activeJob, status: 'in-progress' })}
                  className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800"
                >
                  {activeJob.type === 'ride' ? 'Start Trip' : 'Picked Up Order'}
                </button>
              )}
              {activeJob.status === 'in-progress' && (
                <button
                  onClick={handleCompleteJob}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700"
                >
                  Complete {activeJob.type === 'ride' ? 'Trip' : 'Delivery'}
                </button>
              )}
              <button
                onClick={() => setActiveJob(null)}
                className="w-full py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Driver Dashboard</h1>
              <p className="text-sm text-gray-300">{user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>

          {/* Online Toggle */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
            <div>
              <p className="font-semibold">
                {isOnline ? '🟢 You\'re Online' : '⚫ You\'re Offline'}
              </p>
              <p className="text-sm text-gray-300">
                {isOnline ? 'Accepting requests' : 'Go online to receive requests'}
              </p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isOnline
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">Today's Earnings</h2>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold mb-2">${earnings.today.toFixed(2)}</p>
              <p className="text-sm opacity-90">{earnings.trips} trips completed</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">This Week</p>
              <p className="text-2xl font-bold">${earnings.week.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Requests */}
        {isOnline ? (
          <div className="space-y-3">
            <h3 className="text-xl font-bold px-2">
              {requests.length > 0 ? 'New Requests' : 'Waiting for requests...'}
            </h3>
            {requests.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold text-gray-600">Looking for nearby requests</p>
                <p className="text-sm text-gray-500 mt-2">You'll be notified when a request comes in</p>
              </div>
            )}
            {requests.map(request => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">
                      {request.type === 'ride' ? '👤' : '🍔'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{request.passenger.name}</h4>
                      <p className="text-sm text-gray-600">⭐ {request.passenger.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">${request.fare.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{request.distance}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="font-medium">{request.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">🎯</span>
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="font-medium">{request.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(request)}
                    className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">😴</div>
            <p className="text-xl font-semibold text-gray-600">You're offline</p>
            <p className="text-sm text-gray-500 mt-2">Go online to start receiving requests</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Total Trips</p>
            <p className="text-3xl font-bold">247</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            <p className="text-3xl font-bold">⭐ {user.rating?.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
