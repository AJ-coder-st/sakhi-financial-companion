import React from 'react';
import LiveTextTranslateScanner from '../components/LiveTextTranslateScanner';

const LiveScannerTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Live Text Translator Test
          </h1>
          <p className="text-gray-600">
            Test the real-time camera text detection and translation system
          </p>
        </div>
        
        <LiveTextTranslateScanner />
      </div>
    </div>
  );
};

export default LiveScannerTest;
