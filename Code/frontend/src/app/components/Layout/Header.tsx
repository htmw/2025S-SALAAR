import { useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Avatar,
  Container,
  IconButton,
  Dialog,
} from '@radix-ui/themes';
import {
  HamburgerMenuIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import Link from 'next/link';

interface HeaderProps {
  activeTab: 'home' | 'detection' | 'history' | 'about' | 'diseases';
  setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Box style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Container size="3">
        <Flex justify="between" align="center" py="4">
          <Flex gap="2" align="center">
            <Link href="/" onClick={() => setActiveTab('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar fallback="P" color="green" />
              <Text size="5" weight="bold" color="green">Phytora</Text>
            </Link>
          </Flex>
          
          {/* Desktop Navigation */}
          <Flex gap="6" display={{ initial: 'none', md: 'flex' }}>
            <Link href="/" onClick={() => setActiveTab('home')} passHref>
              <Text
                weight="medium" 
                color={activeTab === 'home' ? "green" : undefined}
                style={{ cursor: 'pointer' }}
              >
                Home
              </Text>
            </Link>
            
            <Link href="/#detection" onClick={() => setActiveTab('detection')} passHref>
              <Text
                weight="medium"
                color={activeTab === 'detection' ? "green" : undefined}
                style={{ cursor: 'pointer' }}
              >
                Detection
              </Text>
            </Link>
            
            <Link href="/#history" onClick={() => setActiveTab('history')} passHref>
              <Text
                weight="medium"
                color={activeTab === 'history' ? "green" : undefined}
                style={{ cursor: 'pointer' }}
              >
                History
              </Text>
            </Link>
            
            <Link href="/about" passHref>
              <Text 
                weight="medium"
                color={activeTab === 'about' ? "green" : undefined}
              >
                About
              </Text>
            </Link>
            
            <Link href="/diseases" passHref>
              <Text 
                weight="medium"
                color={activeTab === 'diseases' ? "green" : undefined}
              >
                Diseases
              </Text>
            </Link>
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
                    <Link href="/" passHref>
                      <Text 
                        onClick={() => {
                          setActiveTab('home');
                          setMobileMenuOpen(false);
                        }} 
                        size="3" 
                        weight="medium" 
                        color={activeTab === 'home' ? "green" : undefined}
                        style={{ cursor: 'pointer' }}
                      >
                        Home
                      </Text>
                    </Link>
                    
                    <Link href="/#detection" passHref>
                      <Text 
                        onClick={() => {
                          setActiveTab('detection');
                          setMobileMenuOpen(false);
                        }} 
                        size="3" 
                        weight="medium"
                        color={activeTab === 'detection' ? "green" : undefined}
                        style={{ cursor: 'pointer' }}
                      >
                        Detection
                      </Text>
                    </Link>
                    
                    <Link href="/#history" passHref>
                      <Text 
                        onClick={() => {
                          setActiveTab('history');
                          setMobileMenuOpen(false);
                        }} 
                        size="3" 
                        weight="medium"
                        color={activeTab === 'history' ? "green" : undefined}
                        style={{ cursor: 'pointer' }}
                      >
                        History
                      </Text>
                    </Link>
                    
                    <Link href="/about" passHref>
                      <Text 
                        onClick={() => setMobileMenuOpen(false)} 
                        size="3" 
                        weight="medium"
                        color={activeTab === 'about' ? "green" : undefined}
                      >
                        About
                      </Text>
                    </Link>
                    
                    <Link href="/diseases" passHref>
                      <Text 
                        onClick={() => setMobileMenuOpen(false)} 
                        size="3" 
                        weight="medium"
                        color={activeTab === 'diseases' ? "green" : undefined}
                      >
                        Diseases
                      </Text>
                    </Link>
                  </Flex>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}