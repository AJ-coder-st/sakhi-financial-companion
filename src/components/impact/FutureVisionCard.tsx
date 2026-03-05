import React, { useState } from 'react';
import { TrendingUp, DollarSign, PiggyBank, Award } from 'lucide-react';

interface FinancialData {
  monthlyIncome: number;
  monthlySavings: number;
  businessInterest?: number;
}

interface FutureProjection {
  futureSavings: number;
  futureIncome: number;
  status: string;
}

export const FutureVisionCard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyIncome: 3000,
    monthlySavings: 500,
    businessInterest: 0
  });

  const [projection, setProjection] = useState<FutureProjection>({
    futureSavings: 6000,
    futureIncome: 4200,
    status: 'Emerging Entrepreneur'
  });

  const calculateProjection = () => {
    const futureSavings = financialData.monthlySavings * 12;
    const futureIncome = financialData.monthlyIncome + (financialData.monthlyIncome * 0.4);
    
    let status = 'Growing Entrepreneur';
    if (futureIncome > 10000) status = 'Established Business Owner';
    else if (futureIncome > 7000) status = 'Successful Entrepreneur';
    else if (futureIncome > 5000) status = 'Emerging Entrepreneur';

    setProjection({ futureSavings, futureIncome, status });
  };

  React.useEffect(() => {
    calculateProjection();
  }, [financialData]);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Future Financial Vision
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-gray-500" />
            Today
          </h3>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Savings</span>
              <span className="text-2xl font-bold text-gray-800">₹{financialData.monthlySavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Income</span>
              <span className="text-2xl font-bold text-gray-800">₹{financialData.monthlyIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            After 12 Months with IRAIVI
          </h3>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-center mb-3">
              <span className="text-emerald-100">Savings</span>
              <span className="text-3xl font-bold animate-pulse">₹{projection.futureSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-100">Income</span>
              <span className="text-3xl font-bold animate-pulse">₹{projection.futureIncome.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-4 py-2 text-center">
            <span className="text-white font-bold text-lg">{projection.status}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-4">Customize Your Projection</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Monthly Income (₹)</label>
            <input
              type="number"
              value={financialData.monthlyIncome}
              onChange={(e) => setFinancialData({...financialData, monthlyIncome: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Monthly Savings (₹)</label>
            <input
              type="number"
              value={financialData.monthlySavings}
              onChange={(e) => setFinancialData({...financialData, monthlySavings: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Business Interest (%)</label>
            <input
              type="number"
              value={financialData.businessInterest}
              onChange={(e) => setFinancialData({...financialData, businessInterest: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-6 py-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-semibold">
              {Math.round(((projection.futureIncome - financialData.monthlyIncome) / financialData.monthlyIncome) * 100)}% Income Growth
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Transform your financial future with IRAIVI</p>
        </div>
      </div>
    </div>
  );
};
