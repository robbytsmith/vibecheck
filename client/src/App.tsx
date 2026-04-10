import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreditSentinel from './pages/CreditSentinel';
import LoopDetector from './pages/LoopDetector';
import PriorArt from './pages/PriorArt';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/credit-sentinel" element={<CreditSentinel />} />
        <Route path="/loop-detector" element={<LoopDetector />} />
        <Route path="/prior-art" element={<PriorArt />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
