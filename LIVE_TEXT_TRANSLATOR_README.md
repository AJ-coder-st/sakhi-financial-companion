# Live Text Translator - Real-time Camera OCR + Translation + TTS

A complete browser-based real-time text detection, translation, and text-to-speech system similar to Google Lens, built with free technologies.

## 🚀 Features

- **Real-time Camera OCR**: Detect text from live camera feed every 1.5 seconds
- **Multilingual Support**: English, Tamil, Hindi, Telugu
- **Instant Translation**: Free LibreTranslate API integration
- **Text-to-Speech**: Browser speech synthesis with language-specific voices
- **Intelligent Fallback**: Cloud TTS when local voices unavailable
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React + TypeScript**: Component-based architecture
- **Tesseract.js**: WebAssembly OCR engine
- **Browser MediaDevices API**: Camera access and control
- **Web Speech API**: Text-to-speech synthesis
- **LibreTranslate**: Free translation service

### OCR Engine
- **Tesseract.js 5.x**: Multilingual text recognition
- **Languages**: English + Tamil + Hindi + Telugu
- **Performance**: Optimized frame processing (640x480)
- **Interval**: 1500ms between captures

### Translation Service
- **LibreTranslate.de**: Free, no API key required
- **Auto-detection**: Source language detected automatically
- **Target Languages**: en, ta, hi, te
- **Format**: Plain text translation

### Text-to-Speech
- **Browser Speech Synthesis**: Native Web Speech API
- **Voice Selection**: Language-specific voice matching
- **Fallback System**: Cloud TTS for missing local voices
- **Optimization**: Language-specific speech rates

## 📦 Installation

```bash
# Install Tesseract.js for OCR
npm install tesseract.js

# Other dependencies are already included
# - React, TypeScript, Lucide Icons
# - Tailwind CSS for styling
```

## 🎯 Quick Start

### 1. Import the Component
```typescript
import LiveTextTranslateScanner from './components/LiveTextTranslateScanner';
```

### 2. Use in Your App
```typescript
function App() {
  return (
    <div className="app">
      <LiveTextTranslateScanner />
    </div>
  );
}
```

### 3. Test Page
```typescript
// Visit: http://localhost:3000/live-scanner-test
import LiveScannerTest from './pages/LiveScannerTest';
```

## 🔧 Component API

### Props
The component is self-contained and requires no props.

### State Management
Internal state handles:
- Camera stream management
- OCR processing status
- Translation results
- TTS playback control
- Error handling

### Language Support
```typescript
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
];
```

## 🎮 Usage Instructions

### 1. Start Camera
- Click "Start Camera" button
- Grant camera permissions when prompted
- Rear camera preferred (environment facing mode)

### 2. Point at Text
- Aim camera at text documents, signs, or screens
- OCR processes every 1.5 seconds
- Progress shown during processing

### 3. View Results
- **Detected Text**: Original text from OCR
- **Translated Text**: Translation in selected language
- Results update automatically with new detections

### 4. Listen to Translation
- Click "Speak Translation" button
- Text-to-speech reads translated text aloud
- Language-specific voice optimization

## 🔍 OCR Configuration

### Tesseract.js Settings
```typescript
const result = await Tesseract.recognize(
  canvas,
  'eng+tam+hin+tel',  // Multilingual support
  {
    logger: (m) => console.log(m)  // Progress tracking
  }
);
```

### Frame Processing
```typescript
// Optimized for performance
canvas.width = 640;
canvas.height = 480;
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
```

### Duplicate Prevention
```typescript
// Skip empty or duplicate results
if (!detectedText || detectedText === lastDetectionRef.current) {
  return;
}
```

## 🌐 Translation Integration

### LibreTranslate API
```typescript
const response = await fetch('https://libretranslate.de/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q: detectedText,
    source: 'auto',
    target: targetLanguage,
    format: 'text'
  })
});
```

### Error Handling
- Network failures: Show user-friendly error
- Service unavailable: Fallback to original text
- Rate limiting: Automatic retry with delay

## 🗣️ Text-to-Speech System

### Voice Loading
```typescript
const loadVoices = () => {
  return new Promise(resolve => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    }
  });
};
```

### Language Selection
```typescript
const voice = voices.find(v => 
  v.lang.toLowerCase().startsWith(lang)
);
```

### Speech Optimization
```typescript
// Language-specific rates
if (lang === 'hi') {
  utterance.rate = 0.85;  // Slower for Hindi
} else if (lang === 'ta' || lang === 'te') {
  utterance.rate = 0.9;   // Medium for Indian languages
}
```

## 🎨 Styling

### CSS Classes
- `.live-scanner-container`: Main container
- `.camera-preview`: Video frame styling
- `.ocr-overlay`: Progress overlay
- `.detection-result`: Result containers
- `.speak-button`: TTS trigger button

### Responsive Design
- Mobile-first approach
- Touch-friendly controls
- Adaptive camera preview
- Flexible layout for different screen sizes

## ⚡ Performance Optimizations

### OCR Performance
- Frame resize to 640x480 for faster processing
- 1500ms interval to prevent browser overload
- Duplicate detection prevention
- Canvas-based frame capture

### Memory Management
- Stream cleanup on component unmount
- Interval cleanup when camera stops
- Voice loading optimization
- Error boundary implementation

### Network Optimization
- Translation request debouncing
- Automatic retry on failure
- Fallback to original text
- Progress indication during processing

## 🚨 Error Handling

### Camera Errors
- **Permission Denied**: User-friendly instructions
- **No Camera**: Clear error message
- **Stream Failure**: Automatic retry option

### OCR Errors
- **Tesseract Loading**: Fallback message
- **Processing Failure**: Retry mechanism
- **Empty Results**: Continue scanning

### Translation Errors
- **Network Issues**: Show connectivity error
- **Service Unavailable**: Use original text
- **Rate Limiting**: Automatic retry with delay

### TTS Errors
- **Voice Loading**: Fallback to default
- **Speech Failure**: User notification
- **Browser Support**: Compatibility check

## 🔧 Development

### Local Development
```bash
# Start development server
npm run dev

# Test OCR functionality
npm run test:tesseract

# Test translation API
npm run test:translate
```

### Browser Compatibility
- **Chrome**: Full support recommended
- **Firefox**: OCR may be slower
- **Safari**: Camera permissions required
- **Edge**: Full support

### Mobile Considerations
- **Camera Access**: Rear camera preferred
- **Touch Controls**: Larger tap targets
- **Performance**: Optimized frame rate
- **Orientation**: Landscape recommended

## 📱 Mobile Usage

### Camera Permissions
1. Tap "Start Camera"
2. Allow camera access in browser prompt
3. Grant permission for text detection

### Optimal Conditions
- **Good Lighting**: Bright, even illumination
- **Text Focus**: Clear, high-contrast text
- **Stable Camera**: Minimize hand shake
- **Text Size**: 12pt or larger recommended

## 🧪 Testing

### Test Scenarios
1. **English Text**: Documents, signs, screens
2. **Mixed Languages**: Bilingual content
3. **Handwriting**: Cursive, printed text
4. **Low Light**: Challenging conditions
5. **Mobile Devices**: Touch interaction

### Test Pages
- `test-live-scanner.html`: Standalone test
- `LiveScannerTest.tsx`: React component test
- Integration with main dashboard

## 🔮 Future Enhancements

### Planned Features
- **Offline OCR**: Local language models
- **Voice Commands**: Start/stop with speech
- **Image Upload**: Photo text detection
- **History**: Recent translations
- **Batch Processing**: Multiple text areas

### Performance Improvements
- **Web Workers**: OCR in background thread
- **Frame Differencing**: Process only changed frames
- **Adaptive Interval**: Dynamic processing speed
- **Voice Caching**: Preload language voices

## 📄 License

This implementation uses:
- **Tesseract.js**: Apache License 2.0
- **LibreTranslate**: GPL v3
- **Browser APIs**: Native web standards

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Test on multiple browsers
3. Ensure mobile compatibility
4. Add comprehensive error handling
5. Document new features

### Code Style
- Use functional components with hooks
- Implement proper TypeScript types
- Follow React best practices
- Add accessibility features
- Include responsive design

---

## 🎯 Quick Summary

**Live Text Translator** provides:
- ✅ Real-time camera text detection
- ✅ Instant multilingual translation  
- ✅ Natural text-to-speech playback
- ✅ Free, browser-based solution
- ✅ Mobile and desktop compatible
- ✅ Production-ready implementation

Perfect for hackathons, educational tools, accessibility features, and multilingual applications!
