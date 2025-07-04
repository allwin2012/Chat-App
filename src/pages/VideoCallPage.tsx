import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../data/mockData';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, ScreenShare } from 'lucide-react';

const VideoCallPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'in-call' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  
  const user = userId ? getUserById(userId) : null;
  
  // Set document title
  useEffect(() => {
    document.title = user ? `Video Call with ${user.name} | Chat` : 'Video Call | Chat';
    
    // Cleanup when leaving page
    return () => {
      document.title = 'Chat';
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
    let interval: ReturnType<typeof setInterval>;
 
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
      <div className="flex-1 flex flex-col relative">
        {/* Main video area */}
        <div className="absolute inset-0 flex items-center justify-center">
          {callStatus === 'in-call' ? (
            <div className="w-full h-full max-w-4xl mx-auto relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover filter blur-sm"
                style={{ objectPosition: 'center 25%' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-64 h-64 rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-lg">
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'ringing' && 'Ringing...'}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          )}
        </div>
        
        {/* Self view */}
        {callStatus === 'in-call' && (
          <div className="absolute bottom-24 right-4 z-10">
            <div className="w-36 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <img 
                    src="https://i.pravatar.cc/150?img=8" 
                    alt="You"
                    className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                  />
                  {!isCameraOn && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <CameraOff size={24} className="mb-2" />
                      <span className="text-xs">Camera off</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Call info overlay */}
        {callStatus === 'in-call' && (
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-gray-300">{formatDuration(callDuration)}</p>
            </div>
            <div className="bg-black/30 px-3 py-1 rounded-full text-sm">
              Video Call
            </div>
          </div>
        )}
        
        {/* Call controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full ${
                isMuted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } transition-colors duration-200 shadow-lg`}
              disabled={callStatus !== 'in-call'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-lg"
              aria-label="End call"
            >
              <PhoneOff size={24} />
            </button>
            
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-full ${
                !isCameraOn 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } transition-colors duration-200 shadow-lg`}
              disabled={callStatus !== 'in-call'}
              aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
            </button>
            
            <button 
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200 shadow-lg"
              disabled={callStatus !== 'in-call'}
              aria-label="Share screen"
            >
              <ScreenShare size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
