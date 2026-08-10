import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from '../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../modules/auth/screens/RegisterScreen';
import { ConversationListScreen } from '../modules/messaging/screens/ConversationListScreen';
import { ChatScreen } from '../modules/messaging/screens/ChatScreen';
import { CallScreen } from '../modules/calls/screens/CallScreen';
import { CallHistoryScreen } from '../modules/calls/screens/CallHistoryScreen';
import { MediaViewerScreen } from '../modules/media/screens/MediaViewerScreen';
import { useAuthStore } from '../modules/auth/store/auth.store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={<ProtectedRoute><ConversationListScreen /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
        <Route path="/call/:callId"         element={<ProtectedRoute><CallScreen /></ProtectedRoute>} />
        <Route path="/call-history"         element={<ProtectedRoute><CallHistoryScreen /></ProtectedRoute>} />
        <Route path="/media/:attachmentId"  element={<ProtectedRoute><MediaViewerScreen /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
