import React, { useState } from 'react';
import { Users, MessageCircle, Star, MapPin, Briefcase, Lock, CheckCircle } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  business: string;
  experience: string;
  location: string;
  specialties: string[];
  available: boolean;
  rating: number;
  image: string;
}

interface MentorConnectProps {
  userCredits: number;
  canConnect: boolean;
}

const MentorConnect: React.FC<MentorConnectProps> = ({ userCredits, canConnect }) => {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState<{ [key: string]: boolean }>({});

  const mentors: Mentor[] = [
    {
      id: 'mentor1',
      name: 'लक्ष्मी देवी / Lakshmi Devi',
      business: 'घरेलू अचार / Homemade Pickles',
      experience: '8 वर्ष / 8 years',
      location: 'जयपुर, राजस्थान / Jaipur, Rajasthan',
      specialties: ['food-business', 'traditional-foods', 'local-marketing'],
      available: true,
      rating: 4.8,
      image: '👩‍🍳'
    },
    {
      id: 'mentor2',
      name: 'सीता जैन / Sita Jain',
      business: 'सूती का कपड़ा व्यवसाय / Tailoring Shop',
      experience: '12 वर्ष / 12 years',
      location: 'वाराणसी, महाराष्ट्र / Varanasi, UP',
      specialties: ['textiles', 'women-empowerment', 'skill-training'],
      available: true,
      rating: 4.9,
      image: '🧵'
    },
    {
      id: 'mentor3',
      name: 'रमेश चंद्र / Ramesh Chandra',
      business: 'छोटे का सामान / Small Tea Stall',
      experience: '15 वर्ष / 15 years',
      location: 'हैदराबाद, बिहार / Hyderabad, Telangana',
      specialties: ['retail', 'customer-service', 'business-planning'],
      available: true,
      rating: 4.7,
      image: '🍵'
    },
    {
      id: 'mentor4',
      name: 'गीता बाई / Geeta Bai',
      business: 'फूल और सब्जी / Flour and Spices',
      experience: '10 वर्ष / 10 years',
      location: 'इंदौर, मध्य प्रदेश / Indore, MP',
      specialties: ['food-processing', 'packaging', 'distribution'],
      available: false,
      rating: 4.6,
      image: '🌾'
    }
  ];

  const handleConnectRequest = (mentorId: string) => {
    if (!canConnect) return;
    
    setRequestSent(prev => ({ ...prev, [mentorId]: true }));
    setSelectedMentor(mentorId);
    
    // In a real app, this would send a notification to the mentor
    console.log(`Connection request sent to mentor: ${mentorId}`);
  };

  const getSpecialtyIcon = (specialty: string) => {
    const icons: { [key: string]: string } = {
      'food-business': '🍽',
      'traditional-foods': '🥘',
      'local-marketing': '📢',
      'textiles': '🧵',
      'women-empowerment': '👩',
      'skill-training': '📚',
      'retail': '🏪',
      'customer-service': '👥',
      'business-planning': '📋',
      'food-processing': '🌾',
      'packaging': '📦',
      'distribution': '🚚'
    };
    return icons[specialty] || '💼';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          उद्यमगी से जुड़ें / Connect with Mentors
        </h2>
        <div className="text-sm text-gray-600">
          {canConnect 
            ? `${userCredits} क्रेडिट्स उपलब्ध हैं / ${userCredits} credits available`
            : `150 क्रेडिट्स चाहिए / Need 150 credits to unlock`
          }
        </div>
      </div>

      {/* Credits Status */}
      {!canConnect && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800">मेंटर एक्सेस अनलॉक करें / Mentor Access Locked</h3>
              <p className="text-sm text-orange-700 mt-1">
                अभी {150 - userCredits} क्रेडिट्स और कमाने चाहिए / Complete {150 - userCredits} more credits to unlock mentor connections
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <div 
            key={mentor.id}
            className={`border-2 rounded-xl p-4 transition-all duration-300 ${
              mentor.available 
                ? 'border-purple-300 hover:shadow-lg bg-white' 
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
          >
            {/* Mentor Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">{mentor.image}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{mentor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{mentor.business}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{mentor.location}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(mentor.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm font-medium text-gray-700 ml-1">{mentor.rating}</span>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mb-3">
              {mentor.available ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">उपलब्ध है / Available</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">व्यस्त व्यस्थ / Busy</span>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="text-sm text-gray-600 mb-3">
              <strong>अनुभव / Experience:</strong> {mentor.experience}
            </div>

            {/* Specialties */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">विशेषषण / Specialties:</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map((specialty, index) => (
                  <div 
                    key={index}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <span>{getSpecialtyIcon(specialty)}</span>
                    <span>{specialty.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Button */}
            {mentor.available && canConnect && (
              <button
                onClick={() => handleConnectRequest(mentor.id)}
                disabled={requestSent[mentor.id]}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                  requestSent[mentor.id]
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : selectedMentor === mentor.id
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {requestSent[mentor.id] ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>अनुरोण भेजा गया / Request Sent</span>
                  </>
                ) : selectedMentor === mentor.id ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>संदेश भेजें / Send Message</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>जुड़ें / Connect</span>
                  </>
                )}
              </button>
            )}

            {!mentor.available && (
              <div className="text-center text-sm text-gray-500 py-2">
                वर्तमान में उपलब्ध होंगे / Will be available soon
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">उद्यमगी कैसे काम करता है? / How Mentorship Works:</h3>
        <div className="text-sm text-purple-700 space-y-2">
          <p><strong>1. क्रेडिट्स कमाएं / Earn Credits:</strong> क्वेस्ट और दैनिक चुनौतियां पूरी करें / Complete quests and daily challenges</p>
          <p><strong>2. उद्यमगी चुनें / Choose Mentor:</strong> अपनी जरूरत के अनुसार अनुसार उद्यमगी से जुड़ें / Select a mentor who matches your business goals</p>
          <p><strong>3. संदेश भेजें / Send Message:</strong> अपने व्यापारिक प्रश्न पूछें / Ask your business questions and get guidance</p>
          <p><strong>4. सीखना और बढ़ना / Learn & Grow:</strong> उद्यमगी के मार्गदर्शन से सीखें और अपना व्यापार बढ़ाएं / Learn from their experience and grow your business</p>
        </div>
      </div>
    </div>
  );
};

export default MentorConnect;
