import React, { useState, useEffect } from 'react';
import { Mic, Lightbulb, TrendingUp, Award, DollarSign, Target } from 'lucide-react';

interface BusinessSuggestion {
  business: string;
  investment: number;
  monthlyProfit: number;
  scheme: string;
  category: string;
}

export const VoiceMentor: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [investment, setInvestment] = useState(2000);
  const [suggestion, setSuggestion] = useState<BusinessSuggestion | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateSuggestion = (amount: number): BusinessSuggestion => {
    if (amount < 3000) {
      return {
        business: "Homemade Snacks",
        investment: 1500,
        monthlyProfit: 3500,
        scheme: "PMEGP Micro Loan",
        category: "Food Business"
      };
    } else if (amount < 5000) {
      return {
        business: "Tailoring Business",
        investment: 4000,
        monthlyProfit: 6000,
        scheme: "PM Vishwakarma Yojana",
        category: "Textile & Garments"
      };
    } else if (amount < 10000) {
      return {
        business: "Vegetable Resale",
        investment: 8000,
        monthlyProfit: 12000,
        scheme: "Agricultural Infrastructure Fund",
        category: "Agriculture"
      };
    } else {
      return {
        business: "Small Grocery Shop",
        investment: 15000,
        monthlyProfit: 18000,
        scheme: "MUDRA Loan Scheme",
        category: "Retail"
      };
    }
  };

  useEffect(() => {
    setSuggestion(generateSuggestion(investment));
  }, [investment]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        
        // Extract investment amount from speech
        const amountMatch = transcript.match(/(\d+)/);
        if (amountMatch) {
          const amount = parseInt(amountMatch[1]);
          setInvestment(amount);
          setIsProcessing(true);
          setTimeout(() => {
            setSuggestion(generateSuggestion(amount));
            setIsProcessing(false);
          }, 1500);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Fallback to manual input
      };

      recognition.start();
    } else {
      // Fallback for browsers without speech recognition
      alert('Voice recognition is not supported in your browser. Please use the input field below.');
    }
  };

  const handleManualInput = () => {
    const amountMatch = transcript.match(/(\d+)/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1]);
      setInvestment(amount);
      setIsProcessing(true);
      setTimeout(() => {
        setSuggestion(generateSuggestion(amount));
        setIsProcessing(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-amber-600" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          IRAIVI Voice Mentor
        </h2>
      </div>

      {/* Voice Input Section */}
      <div className="bg-white rounded-xl p-6 border border-amber-200 mb-6">
        <div className="text-center mb-4">
          <p className="text-gray-700 font-medium mb-4">
            Ask: "I have ₹2000. What business can I start?"
          </p>
          
          <div className="flex justify-center mb-4">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`relative p-6 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              } text-white shadow-lg`}
            >
              <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
              )}
            </button>
          </div>

          {transcript && (
            <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
              <p className="text-amber-800">
                <strong>You said:</strong> "{transcript}"
              </p>
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              onClick={handleManualInput}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Ask IRAIVI
            </button>
          </div>
        </div>
      </div>

      {/* Investment Amount Display */}
      <div className="bg-white rounded-xl p-4 border border-amber-200 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Your Investment:</span>
          <span className="text-3xl font-bold text-amber-600">₹{investment.toLocaleString()}</span>
        </div>
      </div>

      {/* AI Suggestion Card */}
      {isProcessing ? (
        <div className="bg-white rounded-xl p-8 border border-amber-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-600 font-medium">IRAIVI is analyzing your options...</p>
        </div>
      ) : suggestion && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-amber-100" />
            <h3 className="text-2xl font-bold">IRAIVI Mentor Suggestion</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-100" />
                <span className="text-amber-100 font-medium">Recommended Business</span>
              </div>
              <p className="text-2xl font-bold text-white">{suggestion.business}</p>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-100" />
                <span className="text-amber-100 font-medium">Category</span>
              </div>
              <p className="text-lg font-semibold text-amber-100">{suggestion.category}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-100" />
                <span className="text-amber-100 font-medium">Investment Needed</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{suggestion.investment.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-100" />
                <span className="text-amber-100 font-medium">Est. Monthly Profit</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{suggestion.monthlyProfit.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-100" />
              <span className="text-amber-100 font-medium">Relevant Government Scheme</span>
            </div>
            <p className="text-xl font-bold text-amber-100">{suggestion.scheme}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-amber-100">
              <span className="text-sm">Return on Investment: </span>
              <span className="text-xl font-bold">
                {Math.round(((suggestion.monthlyProfit - investment/12) / investment) * 100)}%
              </span>
            </div>
            <button className="bg-white text-amber-600 px-6 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Quick Investment Options */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">Quick Investment Options:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1000, 2000, 5000, 10000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setInvestment(amount);
                setSuggestion(generateSuggestion(amount));
              }}
              className={`p-3 rounded-lg border transition-all ${
                investment === amount
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              ₹{amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-6 py-3">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <span className="text-amber-800 font-semibold">
            AI-Powered Business Guidance
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Get personalized business recommendations based on your investment capacity</p>
      </div>
    </div>
  );
};
