import {
    Flex,
    Box,
    Text,
    Heading,
    Button,
    Grid,
    Card,
    Container,
    Section,
    AspectRatio,
    Callout,
  } from '@radix-ui/themes';
  import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
  import { ScanHistory } from '../../types';
  
  interface RecentScansSectionProps {
    scanHistory: ScanHistory[];
    setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  }
  
  export default function RecentScansSection({ scanHistory, setActiveTab }: RecentScansSectionProps) {
    // Convert recent scans for display on home page
    const recentScans = scanHistory.slice(0, 3).map(scan => ({
      id: scan.id,
      date: new Date(scan.date).toLocaleDateString(),
      status: scan.result.status,
      disease: scan.result.disease,
      image: scan.image
    }));
  
    return (
      <Section size="3" style={{ backgroundColor: "white" }}>
        <Container size="3">
          <Heading size="6" mb="5">
            Recent Scans
          </Heading>
          
          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
            {recentScans.length > 0 ? recentScans.map((scan) => (
              <Card key={scan.id}>
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
                  <Heading size="3">Scan</Heading>
                  <Text size="2" color="gray">{scan.date}</Text>
                  <Flex gap="2" align="center">
                    <Box style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '4px', 
                      backgroundColor: scan.status === 'Diseased' ? 'var(--red-9)' : 'var(--green-9)' 
                    }} />
                    <Text size="2">
                      {scan.status === 'Diseased' ? `${scan.disease} Detected` : 'Healthy'}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            )) : (
              <Box style={{ gridColumn: '1 / -1' }}>
                <Callout.Root color="gray">
                  <Callout.Icon>
                    <ExclamationTriangleIcon />
                  </Callout.Icon>
                  <Callout.Text>No scan history available. Start by scanning a leaf.</Callout.Text>
                </Callout.Root>
              </Box>
            )}
          </Grid>
          
          <Flex justify="center" mt="5">
            <Button 
              variant="soft"
              onClick={() => setActiveTab('history')}
            >
              View All Scans
            </Button>
          </Flex>
        </Container>
      </Section>
    );
  }
  