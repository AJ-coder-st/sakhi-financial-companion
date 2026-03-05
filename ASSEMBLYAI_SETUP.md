# AssemblyAI Speech-to-Text Implementation

## Overview
This implementation provides a robust Speech-to-Text (STT) system using AssemblyAI's latest API with enhanced error handling, audio quality optimization, and comprehensive user feedback.

## Features
- **Latest AssemblyAI SDK**: Uses the official AssemblyAI SDK for better reliability
- **Enhanced Audio Quality**: Optimized recording settings for speech recognition
- **Comprehensive Error Handling**: Covers all microphone and API failure scenarios
- **Real-time Feedback**: Hindi/English bilingual error messages
- **Audio Validation**: Checks for minimum/maximum recording duration and file size
- **Auto-timeout**: Prevents excessively long recordings (30-second limit)
- **Secure API Key Handling**: Environment variable based configuration

## Installation

### 1. Install Dependencies
```bash
npm install assemblyai
```

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
# AssemblyAI API Configuration
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# API Base URL
API_BASE=http://localhost:3001

# Other existing environment variables
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Get AssemblyAI API Key
1. Visit [AssemblyAI Dashboard](https://www.assemblyai.com/app)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your API key
5. Add it to your `.env` file

## Implementation Details

### Backend Changes (`server/api-server.ts`)

#### Key Improvements:
1. **Official SDK Usage**: Replaced raw fetch calls with AssemblyAI SDK
2. **Enhanced Validation**: Base64 format validation, file size limits
3. **Better Error Handling**: Specific error messages for different failure scenarios
4. **Improved Polling**: Extended timeout with better status handling
5. **Audio Quality Support**: Proper MIME type handling

#### New Features:
- Audio buffer size validation (max 25MB)
- Base64 format validation
- Enhanced error messages with specific failure reasons
- Transcription confidence and word count reporting
- Better timeout handling (45 seconds max)

### Frontend Changes (`src/components/dashboard/DashboardAssistant.tsx`)

#### Key Improvements:
1. **Audio Quality Enhancement**: Echo cancellation, noise suppression, auto-gain control
2. **Format Optimization**: WebM with Opus codec for better compression
3. **Enhanced Error Handling**: Specific messages for different microphone errors
4. **Audio Validation**: Minimum/maximum duration checks
5. **Real-time Feedback**: Console logging for debugging

#### New Features:
- 16kHz sample rate (optimal for speech recognition)
- Mono audio recording
- Auto-stop after 30 seconds
- Enhanced microphone permission handling
- Better audio chunk collection

## API Endpoints

### POST `/api/stt`

**Request Body:**
```json
{
  "audioBase64": "base64-encoded-audio-data",
  "mimeType": "audio/webm;codecs=opus"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Transcribed text",
  "confidence": 0.95,
  "words": 42
}
```

**Error Response:**
```json
{
  "error": "Specific error message"
}
```

## Error Handling

### Frontend Errors:
- **Permission Denied**: Microphone access not granted
- **Device Not Found**: No microphone connected
- **Device in Use**: Microphone already being used
- **Not Supported**: Browser doesn't support microphone access
- **Recording Too Short**: Less than 1 second
- **Recording Too Long**: More than 30 seconds

### Backend Errors:
- **API Key Missing**: AssemblyAI API key not configured
- **Invalid Audio Data**: Malformed base64 or empty audio
- **File Too Large**: Audio exceeds 25MB limit
- **Upload Failed**: AssemblyAI upload error
- **Transcription Failed**: AssemblyAI processing error
- **Timeout**: Transcription taking too long

## Audio Specifications

### Supported Formats:
- **Primary**: `audio/webm;codecs=opus`
- **Fallback**: `audio/webm`
- **Last Resort**: `audio/ogg`

### Recording Settings:
- **Sample Rate**: 16kHz
- **Channels**: Mono
- **Echo Cancellation**: Enabled
- **Noise Suppression**: Enabled
- **Auto Gain Control**: Enabled

### File Limits:
- **Minimum**: 1,000 bytes (~1 second)
- **Maximum**: 25MB (AssemblyAI limit)
- **Auto-stop**: 30 seconds

## Testing

### 1. Test Microphone Access
```javascript
// Test in browser console
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log("Microphone working"))
  .catch(err => console.error("Microphone error:", err));
```

### 2. Test API Endpoint
```bash
# Test with curl (replace with actual base64 audio)
curl -X POST http://localhost:3001/api/stt \
  -H "Content-Type: application/json" \
  -d '{"audioBase64":"base64_audio_data","mimeType":"audio/webm"}'
```

### 3. Test AssemblyAI Connection
```javascript
// Test AssemblyAI SDK
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({ apiKey: 'your-api-key' });
client.transcripts.list().then(console.log);
```

## Troubleshooting

### Common Issues:

1. **Microphone Permission Denied**
   - Check browser settings
   - Ensure HTTPS (localhost is exempt)
   - Try refreshing the page

2. **AssemblyAI API Errors**
   - Verify API key is correct
   - Check internet connection
   - Ensure API key has sufficient credits

3. **Audio Quality Issues**
   - Check microphone hardware
   - Ensure quiet environment
   - Speak clearly and at moderate volume

4. **Transcription Accuracy**
   - Ensure good audio quality
   - Speak clearly and slowly
   - Check for background noise

### Debug Mode:
Enable console logging to see detailed information:
- Audio blob sizes
- MIME type selection
- API request/response details
- Transcription status updates

## Performance Considerations

### Frontend:
- Audio processing is done in chunks
- Base64 conversion is optimized
- Memory is cleaned up after each recording

### Backend:
- AssemblyAI SDK handles connection pooling
- Audio upload is streamed
- Polling is efficient with exponential backoff

### Network:
- WebM format provides good compression
- 16kHz mono reduces bandwidth
- Maximum 25MB prevents network issues

## Security

### API Key Protection:
- Stored in environment variables
- Never exposed to frontend
- Server-side only access

### Audio Data:
- Transmitted over HTTPS
- Temporary storage only during processing
- Automatically deleted after transcription

## Maintenance

### Regular Tasks:
1. Monitor AssemblyAI API usage and credits
2. Check error logs for common issues
3. Update AssemblyAI SDK as needed
4. Test with different browsers and devices

### Monitoring:
- API response times
- Transcription accuracy
- Error rates by type
- Audio quality metrics

## Future Enhancements

### Potential Improvements:
1. **Real-time Streaming**: WebSocket-based streaming transcription
2. **Multiple Languages**: Language selection and detection
3. **Audio Enhancement**: Noise reduction and volume normalization
4. **Custom Models**: Industry-specific transcription models
5. **Batch Processing**: Handle multiple audio files

### Scalability:
- Load balancing for multiple API servers
- Caching for common phrases
- Queue system for high-volume usage
- Fallback providers for redundancy

## Support

For issues related to:
- **AssemblyAI API**: Check AssemblyAI documentation
- **Browser Compatibility**: Test in different browsers
- **Network Issues**: Check firewall and proxy settings
- **Audio Hardware**: Verify microphone functionality

## License

This implementation follows the AssemblyAI terms of service and API usage guidelines.
