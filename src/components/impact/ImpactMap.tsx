import React, { useState, useEffect } from 'react';
import { MapPin, Users, Sparkles } from 'lucide-react';

interface Woman {
  id: number;
  name: string;
  village: string;
  business: string;
  lat: number;
  lng: number;
  joinedDate: string;
}

export const ImpactMap: React.FC = () => {
  const [selectedWoman, setSelectedWoman] = useState<Woman | null>(null);
  const [animatedMarkers, setAnimatedMarkers] = useState<Set<number>>(new Set());

  // Mock data for 5 locations across India
  const [women] = useState<Woman[]>([
    {
      id: 1,
      name: "Lakshmi",
      village: "Thanjavur, Tamil Nadu",
      business: "Pickle Making",
      lat: 10.7870,
      lng: 79.1378,
      joinedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sunita",
      village: "Jaipur, Rajasthan",
      business: "Tailoring",
      lat: 26.9124,
      lng: 75.7873,
      joinedDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Meera",
      village: "Hyderabad, Telangana",
      business: "Vegetable Resale",
      lat: 17.3850,
      lng: 78.4867,
      joinedDate: "2024-03-10"
    },
    {
      id: 4,
      name: "Anjali",
      village: "Lucknow, Uttar Pradesh",
      business: "Handicrafts",
      lat: 26.8467,
      lng: 80.9462,
      joinedDate: "2024-01-28"
    },
    {
      id: 5,
      name: "Priya",
      village: "Kolkata, West Bengal",
      business: "Homemade Snacks",
      lat: 22.5726,
      lng: 88.3639,
      joinedDate: "2024-02-05"
    }
  ]);

  useEffect(() => {
    // Animate markers appearing one by one
    women.forEach((woman, index) => {
      setTimeout(() => {
        setAnimatedMarkers(prev => new Set(prev).add(woman.id));
      }, index * 500);
    });
  }, [women]);

  const getMarkerColor = (index: number) => {
    const colors = ['bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Invisible Women Impact Map
        </h2>
      </div>

      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 mb-6 border border-indigo-200">
        <p className="text-center text-indigo-800 font-medium flex items-center justify-center gap-2">
          <Users className="w-5 h-5" />
          Every light represents a woman becoming financially visible.
        </p>
      </div>

      {/* Simple SVG Map of India */}
      <div className="relative bg-white rounded-xl p-8 border border-gray-200 mb-6 overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-64 md:h-80">
          {/* Simplified India Map Outline */}
          <path
            d="M200 80 L250 90 L280 120 L290 160 L270 200 L250 240 L200 250 L150 240 L130 200 L110 160 L120 120 L150 90 Z"
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* State boundaries (simplified) */}
          <line x1="200" y1="150" x2="200" y2="250" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="150" y1="180" x2="250" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Animated Markers */}
          {women.map((woman, index) => {
            const x = 200 + (woman.lng - 78.4867) * 8;
            const y = 200 - (woman.lat - 20.5937) * 4;
            const isAnimated = animatedMarkers.has(woman.id);
            
            return (
              <g key={woman.id}>
                {/* Glowing effect */}
                {isAnimated && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r="15"
                      fill="currentColor"
                      className={`${getMarkerColor(index).replace('bg-', 'text-')} opacity-20 animate-pulse`}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="currentColor"
                      className={`${getMarkerColor(index).replace('bg-', 'text-')} opacity-40 animate-ping`}
                    />
                  </>
                )}
                
                {/* Main marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isAnimated ? "6" : "0"}
                  fill="currentColor"
                  className={`${getMarkerColor(index).replace('bg-', 'text-')} transition-all duration-500 cursor-pointer hover:r-8`}
                  onClick={() => setSelectedWoman(woman)}
                />
                
                {/* Marker pulse animation */}
                {isAnimated && (
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${getMarkerColor(index).replace('bg-', 'text-')} animate-pulse`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-md">
          <h4 className="font-semibold text-gray-700 mb-2 text-sm">Active Entrepreneurs</h4>
          <div className="space-y-1">
            {women.map((woman, index) => (
              <div key={woman.id} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${getMarkerColor(index)} ${animatedMarkers.has(woman.id) ? 'animate-pulse' : ''}`} />
                <span className="text-gray-600">{woman.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Woman Details */}
      {selectedWoman && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white shadow-lg transform transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {selectedWoman.name}
              </h3>
              <div className="space-y-1 text-indigo-100">
                <p><strong>Village:</strong> {selectedWoman.village}</p>
                <p><strong>Business:</strong> {selectedWoman.business}</p>
                <p><strong>Joined:</strong> {new Date(selectedWoman.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedWoman(null)}
              className="text-indigo-200 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Impact Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-indigo-600">{women.length}</div>
          <div className="text-sm text-gray-600">Women Empowered</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">States Reached</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-pink-600">100%</div>
          <div className="text-sm text-gray-600">Financial Inclusion</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-6 py-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-800 font-semibold">
            {women.length} Lights Across India
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Join the movement of financial empowerment</p>
      </div>
    </div>
  );
};
