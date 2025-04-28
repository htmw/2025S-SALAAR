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
    Separator,
  } from '@radix-ui/themes';
  
  export default function OrchardHealthSection() {
    return (
      <Section size="3">
        <Container size="3">
          <Heading size="6" mb="5">
            Orchard Health
          </Heading>
          
          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            <Card>
              <Flex direction="column" gap="3">
                <Heading size="4">Disease Prevalence</Heading>
                <Separator size="4" />
                <AspectRatio ratio={16/9}>
                  <Flex 
                    align="center" 
                    justify="center" 
                    style={{ 
                      backgroundColor: 'var(--gray-3)', 
                      borderRadius: 'var(--radius-2)', 
                      height: '100%' 
                    }}
                  >
                    <Text color="gray">Disease Chart</Text>
                  </Flex>
                </AspectRatio>
              </Flex>
            </Card>
            
            <Card>
              <Flex direction="column" gap="3">
                <Heading size="4">Treatment Schedule</Heading>
                <Separator size="4" />
                <Box>
                  {[
                    { date: 'March 10', treatment: 'Copper Fungicide Application', status: 'Upcoming' },
                    { date: 'March 3', treatment: 'Dormant Oil Spray', status: 'Completed' },
                    { date: 'February 24', treatment: 'Pruning', status: 'Completed' }
                  ].map((item, i) => (
                    <Flex key={i} justify="between" align="center" py="2">
                      <Text size="2">{item.date}</Text>
                      <Text size="2">{item.treatment}</Text>
                      <Text size="2" color={item.status === 'Upcoming' ? 'blue' : 'green'}>
                        {item.status}
                      </Text>
                    </Flex>
                  ))}
                </Box>
                <Button size="2" variant="soft">
                  View Full Plan
                </Button>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>
    );
  }