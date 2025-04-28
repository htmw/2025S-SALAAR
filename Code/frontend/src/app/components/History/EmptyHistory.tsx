import {
    Flex,
    Box,
    Text,
    Heading,
    Button,
  } from '@radix-ui/themes';
  import { ClockIcon } from '@radix-ui/react-icons';
  
  interface EmptyHistoryProps {
    setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  }
  
  export default function EmptyHistory({ setActiveTab }: EmptyHistoryProps) {
    return (
      <Flex direction="column" align="center" gap="4" py="6">
        <Box style={{ 
          backgroundColor: 'var(--gray-3)', 
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ClockIcon width="32" height="32" color="var(--gray-8)" />
        </Box>
        <Heading size="4" align="center">No Scan History</Heading>
        <Text size="2" color="gray" align="center">
          You haven't scanned any leaves yet. Start by analyzing a leaf.
        </Text>
        <Button 
          mt="4"
          onClick={() => setActiveTab('detection')}
        >
          Start Scanning
        </Button>
      </Flex>
    );
  }
  