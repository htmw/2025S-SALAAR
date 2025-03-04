"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Flex,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Card,
  Avatar,
  Separator,
  Container,
  Section,
  IconButton,
  Dialog,
  AspectRatio
} from '@radix-ui/themes';
import {
  LightningBoltIcon,
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  HamburgerMenuIcon
} from '@radix-ui/react-icons';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box>
      {/* Header */}
      <Box style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <Container size="3">
          <Flex justify="between" align="center" py="4">
            <Flex gap="2" align="center">
              <Avatar fallback="P" color="green" />
              <Text size="5" weight="bold" color="green">Phytora</Text>
            </Flex>
            
            {/* Desktop Navigation */}
            <Flex gap="6" display={{ initial: 'none', md: 'flex' }}>
              <Text as="a" href="/" weight="medium" color="green">Home</Text>
              <Text as="a" href="/about" weight="medium">About</Text>
              <Text as="a" href="/detection" weight="medium">Detection</Text>
              <Text as="a" href="/diseases" weight="medium">Diseases</Text>
              <Text as="a" href="/contact" weight="medium">Contact</Text>
            </Flex>
            
            {/* Mobile Menu Button */}
            <Box display={{ md: 'none' }}>
              <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <Dialog.Trigger>
                  <IconButton variant="ghost" color="gray">
                    <HamburgerMenuIcon width="20" height="20" />
                  </IconButton>
                </Dialog.Trigger>
                
                <Dialog.Content style={{ maxWidth: '300px' }}>
                  <Flex direction="column" gap="5">
                    <Flex justify="between" align="center">
                      <Text size="5" weight="bold">Menu</Text>
                      <Dialog.Close>
                        <IconButton variant="ghost" color="gray" size="1">
                          <Cross2Icon width="18" height="18" />
                        </IconButton>
                      </Dialog.Close>
                    </Flex>
                    
                    <Flex direction="column" gap="4">
                      <Text as="a" href="/" size="3" weight="medium" color="green">Home</Text>
                      <Text as="a" href="/about" size="3" weight="medium">About</Text>
                      <Text as="a" href="/detection" size="3" weight="medium">Detection</Text>
                      <Text as="a" href="/diseases" size="3" weight="medium">Diseases</Text>
                      <Text as="a" href="/contact" size="3" weight="medium">Contact</Text>
                    </Flex>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Box>
          </Flex>
        </Container>
      </Box>

      <main>
        {/* Dashboard Overview Section */}
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
                  <Button size="3" asChild>
                    <Link href="/detection">Scan Now</Link>
                  </Button>
                  <Button size="3" variant="outline" asChild>
                    <Link href="/my-reports">View Reports</Link>
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

        {/* Recent Scans Section */}
        <Section size="3" style={{ backgroundColor: "white" }}>
          <Container size="3">
            <Heading size="6" mb="5">
              Recent Scans
            </Heading>
            
            <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <Flex direction="column" gap="2">
                    <AspectRatio ratio={4/3}>
                      <Box style={{ backgroundColor: 'var(--gray-3)', borderRadius: 'var(--radius-2)', height: '100%' }} />
                    </AspectRatio>
                    <Heading size="3">Scan #{item}</Heading>
                    <Text size="2" color="gray">Scan {item}</Text>
                    <Flex gap="2" align="center">
                      <Box style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: item === 1 ? 'var(--red-9)' : 'var(--green-9)' }} />
                      <Text size="2">{item === 1 ? 'Scab Detected' : 'Healthy'}</Text>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
            
            <Flex justify="center" mt="5">
              <Button variant="soft" asChild>
                <Link href="/all-scans">View All Scans</Link>
              </Button>
            </Flex>
          </Container>
        </Section>

        {/* Orchard Health Section */}
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
                  <Button size="2" variant="soft" asChild>
                    <Link href="/treatment-plan">View Full Plan</Link>
                  </Button>
                </Flex>
              </Card>
            </Grid>
          </Container>
        </Section>

        {/* Quick Actions */}
        <Section size="3" style={{ backgroundColor: 'var(--green-9)' }}>
          <Container size="3">
            <Flex justify="between" align="center" direction={{ initial: 'column', sm: 'row' }} gap="4">
              <Heading size="6" style={{ color: 'white' }}>
                Quick Actions
              </Heading>
              <Flex gap="3">
                <Button size="3" style={{ backgroundColor: 'white', color: 'var(--green-9)' }} asChild>
                  <Link href="/detection">
                    New Scan
                  </Link>
                </Button>
                <Button size="3" variant="outline" style={{ borderColor: 'white', color: 'white' }} asChild>
                  <Link href="/alerts">
                    View Alerts
                  </Link>
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Section>
      </main>
    </Box>
  );
}