import {
    Flex,
    Box,
    Text,
    Heading,
    Button,
    Grid,
    Container,
    Section,
    AspectRatio,
  } from '@radix-ui/themes';
  
  interface HeroSectionProps {
    setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  }
  
  export default function HeroSection({ setActiveTab }: HeroSectionProps) {
    return (
      <Section size="3">
        <Container size="3">
          <Grid columns={{ sm: "1", md: "2" }} gap="8">
            <Flex direction="column" justify="center" gap="4">
              <Heading size="8" weight="bold">
                Welcome to Phytora
              </Heading>
              <Text size="4" color="gray">
                Monitor and protect your apple trees with our AI-powered disease detection system.
              </Text>
              <Flex gap="4" mt="2" direction={{ initial: 'column', sm: 'row' }}>
                <Button size="3" onClick={() => setActiveTab('detection')}>
                  Scan Now
                </Button>
                <Button 
                  size="3" 
                  variant="outline"
                  onClick={() => setActiveTab('history')}
                >
                  View Reports
                </Button>
              </Flex>
            </Flex>
            
            <Box>
              <AspectRatio ratio={16/9}>
                <Flex 
                  align="center" 
                  justify="center" 
                  style={{ 
                    backgroundColor: 'var(--green-3)', 
                    borderRadius: 'var(--radius-4)', 
                    height: '100%' 
                  }}
                >
                  <Text color="green" weight="bold">Your Orchard Health Dashboard</Text>
                </Flex>
              </AspectRatio>
            </Box>
          </Grid>
        </Container>
      </Section>
    );
  }
  