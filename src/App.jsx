import TradingJournal from './TradingJournal'
import LoginScreen from './components/LoginScreen'
import { useAuth } from './hooks/useAuth'
import './index.css'

export default function App() {
  const user = useAuth();

  if (user === undefined) return null; // loading
  if (user === null) return <LoginScreen />;
  return <TradingJournal user={user} />;
}
