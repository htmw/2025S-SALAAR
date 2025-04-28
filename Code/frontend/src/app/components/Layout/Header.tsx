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

interface HeaderProps {
  activeTab: 'home' | 'detection' | 'history';
  setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Box style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Container size="3">
        <Flex justify="between" align="center" py="4">
          <Flex gap="2" align="center">
            <Avatar fallback="P" color="green" />
            <Text size="5" weight="bold" color="green">Phytora</Text>
          </Flex>
          
          {/* Desktop Navigation */}
          <Flex gap="6" display={{ initial: 'none', md: 'flex' }}>
            <Text as="a" href="#" 
              onClick={() => setActiveTab('home')} 
              weight="medium" 
              color={activeTab === 'home' ? "green" : undefined}
              style={{ cursor: 'pointer' }}
            >
              Home
            </Text>
            <Text as="a" href="#" 
              onClick={() => setActiveTab('detection')} 
              weight="medium"
              color={activeTab === 'detection' ? "green" : undefined}
              style={{ cursor: 'pointer' }}
            >
              Detection
            </Text>
            <Text as="a" href="#" 
              onClick={() => setActiveTab('history')} 
              weight="medium"
              color={activeTab === 'history' ? "green" : undefined}
              style={{ cursor: 'pointer' }}
            >
              History
            </Text>
            <Text as="a" href="/about" weight="medium">About</Text>
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
                    <Text as="a" href="#" 
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
                    <Text as="a" href="#" 
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
                    <Text as="a" href="#" 
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
                    <Text as="a" href="/about" size="3" weight="medium">About</Text>
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
  );
}