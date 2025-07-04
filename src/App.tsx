import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import VoiceCallPage from './pages/VoiceCallPage';
import VideoCallPage from './pages/VideoCallPage';
import './index.css';

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/call/voice/:userId" element={<VoiceCallPage />} />
          <Route path="/call/video/:userId" element={<VideoCallPage />} />
          <Route path="/messages" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
