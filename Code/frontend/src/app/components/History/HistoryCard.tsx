import {
    Flex,
    Box,
    Text,
    Card,
    AspectRatio,
    Badge,
    Button,
  } from '@radix-ui/themes';
  import { TrashIcon } from '@radix-ui/react-icons';
  import { ScanHistory } from '../../types';
  
  interface HistoryCardProps {
    scan: ScanHistory;
    deleteScanHistory: (id: string) => void;
  }
  
  export default function HistoryCard({ scan, deleteScanHistory }: HistoryCardProps) {
    return (
      <Card>
        <Flex direction="column" gap="2">
          <AspectRatio ratio={4/3}>
            <img 
              src={scan.image} 
              alt="Leaf scan" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: 'var(--radius-2)' 
              }} 
            />
          </AspectRatio>
          <Flex justify="between" align="center">
            <Flex gap="2" align="center">
              <Box style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: scan.result.status === 'Diseased' ? 'var(--red-9)' : 'var(--green-9)' 
              }} />
              <Text size="2" weight="medium">
                {scan.result.status === 'Diseased' 
                  ? scan.result.disease || 'Disease' 
                  : 'Healthy'}
              </Text>
            </Flex>
            <Button 
              size="1" 
              variant="ghost" 
              color="red"
              onClick={() => deleteScanHistory(scan.id)}
            >
              <TrashIcon width="14" height="14" />
            </Button>
          </Flex>
          <Text size="2" color="gray">{new Date(scan.date).toLocaleString()}</Text>
          {scan.result.advice && (
            <Box style={{ 
              backgroundColor: 'var(--gray-2)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-2)',
              marginTop: '4px'
            }}>
              <Text size="1">{scan.result.advice}</Text>
            </Box>
          )}
          <Badge
            size="1"
            variant="soft"
            color="gray"
          >
            {Math.round(scan.result.confidence)}% confidence
          </Badge>
        </Flex>
      </Card>
    );
  }