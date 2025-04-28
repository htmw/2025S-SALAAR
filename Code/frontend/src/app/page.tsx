"use client";

import { useState, useEffect } from 'react';
import { Box } from '@radix-ui/themes';
import Header from './components/Layout/Header';
import HomePage from './components/Home/HomePage';
import DetectionPage from './components/Detection/DetectionPage';
import HistoryPage from './components/History/HistoryPage';
import { ScanHistory } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'detection' | 'history'>('home');
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);

  // Load scan history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <Box>
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === 'home' ? (
          <HomePage scanHistory={scanHistory} setActiveTab={setActiveTab} />
        ) : activeTab === 'detection' ? (
          <DetectionPage 
            setActiveTab={setActiveTab} 
            scanHistory={scanHistory} 
            setScanHistory={setScanHistory} 
          />
        ) : (
          <HistoryPage 
            setActiveTab={setActiveTab} 
            scanHistory={scanHistory} 
            setScanHistory={setScanHistory} 
          />
        )}
      </main>
    </Box>
  );
}