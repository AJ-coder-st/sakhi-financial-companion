import React from 'react';
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react';
import { FutureVisionCard } from '../components/impact/FutureVisionCard';
import { ImpactMap } from '../components/impact/ImpactMap';
import { VoiceMentor } from '../components/impact/VoiceMentor';

export const ImpactDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IRAIVI Impact Dashboard</h1>
                <p className="text-sm text-gray-600">Empowering Rural Women Entrepreneurs</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">1,247</div>
                <div className="text-xs text-gray-600">Women Empowered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">₹2.4M</div>
                <div className="text-xs text-gray-600">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-600">States Reached</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-amber-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Transforming Rural India, One Woman at a Time
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven financial empowerment through our interactive dashboard. 
            See your future, join our movement, and get personalized business guidance.
          </p>
        </div>

        {/* Three Main Features */}
        <div className="space-y-8">
          
          {/* Future Vision Card */}
          <section className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-6 py-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-semibold">Financial Future Projection</span>
              </div>
              <p className="text-gray-600 mt-2">Visualize your financial growth over 12 months with IRAIVI</p>
            </div>
            <FutureVisionCard />
          </section>

          {/* Impact Map */}
          <section className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-6 py-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-800 font-semibold">Live Impact Map</span>
              </div>
              <p className="text-gray-600 mt-2">Watch women across India become financially visible</p>
            </div>
            <ImpactMap />
          </section>

          {/* Voice Mentor */}
          <section className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-6 py-3">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-amber-800 font-semibold">AI Business Mentor</span>
              </div>
              <p className="text-gray-600 mt-2">Get personalized business recommendations from IRAIVI</p>
            </div>
            <VoiceMentor />
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-emerald-600 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Join the Movement</h3>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Be part of India's largest rural women empowerment platform. 
            Together, we're creating financial independence for millions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Start Your Journey
            </button>
            <button className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors">
              Partner With Us
            </button>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-lg">
            <div className="text-3xl font-bold text-emerald-600 mb-2">₹15.2M</div>
            <div className="text-sm text-gray-600">Total Income Generated</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-lg">
            <div className="text-3xl font-bold text-amber-600 mb-2">847</div>
            <div className="text-sm text-gray-600">Businesses Started</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-lg">
            <div className="text-3xl font-bold text-pink-600 mb-2">4.8★</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">IRAIVI Financial Companion</h3>
            <p className="text-gray-400 mb-6">
              Empowering rural women with accessible financial technology through voice-first AI and multilingual support.
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">200M+</div>
                <div className="text-sm text-gray-400">Women to Empower</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">10+</div>
                <div className="text-sm text-gray-400">Indian Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-sm text-gray-400">Government Schemes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
