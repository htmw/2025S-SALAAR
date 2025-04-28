import HeroSection from './HeroSection';
import RecentScansSection from './RecentScansSection';
import QuickActions from './QuickActions';
import { ScanHistory } from '../../types';

interface HomePageProps {
  scanHistory: ScanHistory[];
  setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
}

export default function HomePage({ scanHistory, setActiveTab }: HomePageProps) {
  return (
    <>
      <HeroSection setActiveTab={setActiveTab} />
      <RecentScansSection scanHistory={scanHistory} setActiveTab={setActiveTab} />
      <QuickActions setActiveTab={setActiveTab} />
    </>
  );
}