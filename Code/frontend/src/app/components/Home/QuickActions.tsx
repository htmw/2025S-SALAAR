import {
    Flex,
    Heading,
    Button,
    Container,
    Section,
  } from '@radix-ui/themes';
  
  interface QuickActionsProps {
    setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  }
  
  export default function QuickActions({ setActiveTab }: QuickActionsProps) {
    return (
      <Section size="3" style={{ backgroundColor: 'var(--green-9)' }}>
        <Container size="3">
          <Flex justify="between" align="center" direction={{ initial: 'column', sm: 'row' }} gap="4">
            <Heading size="6" style={{ color: 'white' }}>
              Quick Actions
            </Heading>
            <Flex gap="3">
              <Button 
                size="3" 
                style={{ backgroundColor: 'white', color: 'var(--green-9)' }}
                onClick={() => setActiveTab('detection')}
              >
                New Scan
              </Button>
              <Button 
                size="3" 
                variant="outline" 
                style={{ borderColor: 'white', color: 'white' }}
                onClick={() => setActiveTab('history')}
              >
                View History
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Section>
    );
  }