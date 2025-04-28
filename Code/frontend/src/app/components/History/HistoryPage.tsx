import { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Card,
  Grid,
  Container,
  Section,
  Text,
} from '@radix-ui/themes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import { ScanHistory } from '../../types';
import HistoryCard from './HistoryCard';
import EmptyHistory from './EmptyHistory';

interface HistoryPageProps {
  setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  scanHistory: ScanHistory[];
  setScanHistory: (history: ScanHistory[]) => void;
}

export default function HistoryPage({ 
  setActiveTab, 
  scanHistory, 
  setScanHistory 
}: HistoryPageProps) {
  const [historyPage, setHistoryPage] = useState(0);
  const itemsPerPage = 6;
  
  const deleteScanHistory = (id: string) => {
    const updatedHistory = scanHistory.filter(item => item.id !== id);
    setScanHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };
  
  const clearAllHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scanHistory');
  };

  return (
    <Section size="3">
      <Container size="2">
        <Flex direction="column" gap="6">
          <Flex justify="between" align="center">
            <Heading size="6">Scan History</Heading>
            <Flex gap="3">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setActiveTab('home')}
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="soft" 
                color="red"
                onClick={clearAllHistory}
                disabled={scanHistory.length === 0}
              >
                Clear All
              </Button>
            </Flex>
          </Flex>
          
          <Card>
            {scanHistory.length > 0 ? (
              <Flex direction="column" gap="4">
                <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
                  {scanHistory
                    .slice(historyPage * itemsPerPage, (historyPage + 1) * itemsPerPage)
                    .map((scan) => (
                      <HistoryCard 
                        key={scan.id} 
                        scan={scan} 
                        deleteScanHistory={deleteScanHistory} 
                      />
                    ))}
                </Grid>
                
                {/* Pagination */}
                {Math.ceil(scanHistory.length / itemsPerPage) > 1 && (
                  <Flex justify="center" gap="2" mt="4">
                    <Button 
                      size="1" 
                      variant="soft" 
                      disabled={historyPage === 0}
                      onClick={() => setHistoryPage(p => Math.max(0, p - 1))}
                    >
                      <ChevronLeftIcon /> Previous
                    </Button>
                    <Text size="2" style={{ display: 'flex', alignItems: 'center' }}>
                      Page {historyPage + 1} of {Math.ceil(scanHistory.length / itemsPerPage)}
                    </Text>
                    <Button 
                      size="1" 
                      variant="soft"
                      disabled={historyPage >= Math.ceil(scanHistory.length / itemsPerPage) - 1}
                      onClick={() => setHistoryPage(p => Math.min(Math.ceil(scanHistory.length / itemsPerPage) - 1, p + 1))}
                    >
                      Next <ChevronRightIcon />
                    </Button>
                  </Flex>
                )}
                
                <Flex justify="center" mt="2">
                  <Button 
                    onClick={() => setActiveTab('detection')}
                  >
                    Start New Scan
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <EmptyHistory setActiveTab={setActiveTab} />
            )}
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}