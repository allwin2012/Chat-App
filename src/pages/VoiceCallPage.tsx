import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../data/mockData';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';

const VoiceCallPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'in-call' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  
  const user = userId ? getUserById(userId) : null;
  
  // Set document title
  useEffect(() => {
    document.title = user ? `Voice Call with ${user.name} | MochaChat` : 'Voice Call | MochaChat';
    
    // Cleanup when leaving page
    return () => {
      document.title = 'MochaChat';
    };
  }, [user]);
  
  // Redirect if user not found
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
  
  // Simulate call connection
  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setCallStatus('ringing');
    }, 1000);
    
    const timeout2 = setTimeout(() => {
      setCallStatus('in-call');
      setIsCallStarted(true);
    }, 3000);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);
  
  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallStarted && callStatus === 'in-call') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallStarted, callStatus]);
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate(`/chat/${userId}`);
    }, 1000);
  };
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-6">
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto ${
              callStatus === 'in-call' ? 'animate-pulse-slow' : ''
            }`}>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {callStatus === 'in-call' && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
          
          <div className="text-lg font-medium mb-1">
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'ringing' && 'Ringing...'}
            {callStatus === 'in-call' && formatDuration(callDuration)}
            {callStatus === 'ended' && 'Call ended'}
          </div>
          
          <p className="text-sm text-blue-200">
            {callStatus === 'in-call' ? 'Voice Call' : ''}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-auto">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full ${
              isMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            } transition-colors duration-200 shadow-lg`}
            disabled={callStatus !== 'in-call'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            onClick={handleEndCall}
            className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-lg"
            aria-label="End call"
          >
            <PhoneOff size={30} />
          </button>
          
          <button 
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-4 rounded-full ${
              isSpeakerOn 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-red-500 text-white'
            } transition-colors duration-200 shadow-lg`}
            disabled={callStatus !== 'in-call'}
            aria-label={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallPage;
