import React, { useState } from 'react';
import { User } from '../App';

interface RideBookingProps {
  user: User;
}

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface RideOption {
  id: string;
  name: string;
  description: string;
  price: number;
  eta: string;
  capacity: number;
  icon: string;
}

interface ActiveRide {
  id: string;
  driver: {
    name: string;
    rating: number;
    vehicle: string;
    licensePlate: string;
    photo: string;
  };
  pickup: Location;
  dropoff: Location;
  status: 'searching' | 'accepted' | 'arriving' | 'in-progress' | 'completed';
  fare: number;
  eta: string;
}

const rideOptions: RideOption[] = [
  {
    id: 'economy',
    name: 'TAKCI Go',
    description: 'Affordable rides',
    price: 12.50,
    eta: '3 min',
    capacity: 4,
    icon: '🚗',
  },
  {
    id: 'comfort',
    name: 'TAKCI Comfort',
    description: 'Newer cars with extra legroom',
    price: 18.75,
    eta: '5 min',
    capacity: 4,
    icon: '🚙',
  },
  {
    id: 'xl',
    name: 'TAKCI XL',
    description: 'Affordable rides for groups up to 6',
    price: 24.00,
    eta: '7 min',
    capacity: 6,
    icon: '🚐',
  },
  {
    id: 'premium',
    name: 'TAKCI Black',
    description: 'Premium rides in luxury cars',
    price: 35.50,
    eta: '8 min',
    capacity: 4,
    icon: '🚘',
  },
];

export const RideBooking: React.FC<RideBookingProps> = ({ user }) => {
  const [pickup, setPickup] = useState<Location>({ address: '' });
  const [dropoff, setDropoff] = useState<Location>({ address: '' });
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [showRideOptions, setShowRideOptions] = useState(false);

  const handleSearchRide = () => {
    if (pickup.address && dropoff.address) {
      setShowRideOptions(true);
    }
  };

  const handleBookRide = (option: RideOption) => {
    setSelectedRide(option);
    
    const newRide: ActiveRide = {
      id: Math.random().toString(36).substr(2, 9),
      driver: {
        name: 'John Driver',
        rating: 4.9,
        vehicle: 'Toyota Camry',
        licensePlate: 'ABC 1234',
        photo: '👨‍✈️',
      },
      pickup,
      dropoff,
      status: 'searching',
      fare: option.price,
      eta: option.eta,
    };

    setActiveRide(newRide);
    setShowRideOptions(false);

    setTimeout(() => {
      setActiveRide(prev => prev ? { ...prev, status: 'accepted' } : null);
    }, 2000);

    setTimeout(() => {
      setActiveRide(prev => prev ? { ...prev, status: 'arriving' } : null);
    }, 4000);
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    setSelectedRide(null);
    setShowRideOptions(false);
  };

  const handleCompleteRide = () => {
    setActiveRide(null);
    setSelectedRide(null);
    setPickup({ address: '' });
    setDropoff({ address: '' });
  };

  if (activeRide) {
    return (
      <div className="p-4 space-y-4">
        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
          </div>
          <div className="text-center z-10">
            <div className="text-6xl mb-4 animate-bounce">
              {activeRide.status === 'searching' ? '🔍' : '🚗'}
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {activeRide.status === 'searching' && 'Finding your driver...'}
              {activeRide.status === 'accepted' && 'Driver on the way!'}
              {activeRide.status === 'arriving' && 'Driver arriving soon'}
              {activeRide.status === 'in-progress' && 'Enjoy your ride'}
            </p>
          </div>
        </div>

        {/* Driver Info */}
        {activeRide.status !== 'searching' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{activeRide.driver.photo}</div>
                <div>
                  <h3 className="text-xl font-bold">{activeRide.driver.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>⭐ {activeRide.driver.rating}</span>
                    <span>•</span>
                    <span>{activeRide.driver.vehicle}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{activeRide.driver.licensePlate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${activeRide.fare.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{activeRide.eta} away</p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium">{activeRide.pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium">{activeRide.dropoff.address}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelRide}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel Ride
              </button>
              {activeRide.status === 'arriving' && (
                <button
                  onClick={() => setActiveRide({ ...activeRide, status: 'in-progress' })}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
                >
                  Start Trip
                </button>
              )}
              {activeRide.status === 'in-progress' && (
                <button
                  onClick={handleCompleteRide}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                >
                  Complete Trip
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 20px)',
               }}>
          </div>
        </div>
        <div className="text-center z-10">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-xl font-semibold text-gray-600">Interactive Map</p>
          <p className="text-sm text-gray-500">Enter pickup and dropoff locations</p>
        </div>
      </div>

      {/* Location Inputs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl focus-within:border-black">
            <span className="text-2xl">📍</span>
            <input
              type="text"
              value={pickup.address}
              onChange={(e) => setPickup({ address: e.target.value })}
              placeholder="Enter pickup location"
              className="flex-1 outline-none text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dropoff Location
          </label>
          <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl focus-within:border-black">
            <span className="text-2xl">🎯</span>
            <input
              type="text"
              value={dropoff.address}
              onChange={(e) => setDropoff({ address: e.target.value })}
              placeholder="Where to?"
              className="flex-1 outline-none text-lg"
            />
          </div>
        </div>

        <button
          onClick={handleSearchRide}
          disabled={!pickup.address || !dropoff.address}
          className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Search for Rides
        </button>
      </div>

      {/* Ride Options */}
      {showRideOptions && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold px-2">Choose a ride</h3>
          {rideOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleBookRide(option)}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-black"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold">{option.name}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                      <span>{option.eta}</span>
                      <span>•</span>
                      <span>👤 {option.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${option.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Trips */}
      {!showRideOptions && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {[
              { from: '123 Main St', to: 'Central Park', date: 'Today', price: 12.50 },
              { from: 'Airport Terminal 2', to: 'Home', date: 'Yesterday', price: 45.00 },
              { from: 'Office Building', to: 'Restaurant', date: '2 days ago', price: 8.75 },
            ].map((trip, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer">
                <div className="flex-1">
                  <p className="font-medium text-sm">{trip.from} → {trip.to}</p>
                  <p className="text-xs text-gray-500">{trip.date}</p>
                </div>
                <p className="font-bold">${trip.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
