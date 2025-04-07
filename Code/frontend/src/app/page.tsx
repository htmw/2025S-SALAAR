"use client";

import { useState, useRef } from 'react';
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
  AspectRatio,
  TextField,
  TextArea,
  Callout
} from '@radix-ui/themes';
import {
  LightningBoltIcon,
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  HamburgerMenuIcon,
  ExclamationTriangleIcon,
  UploadIcon,
  ReloadIcon
} from '@radix-ui/react-icons';

interface DetectionResult {
  status: 'Healthy' | 'Diseased';
  disease: string | null;    // Added for US2.1
  confidence: number;        // Added for US2.2
  advice: string | null;     // Added for US2.3
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Disease detection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI section state
  const [activeTab, setActiveTab] = useState<'home' | 'detection'>('home');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call the API
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
              <Text as="a" href="#" weight="medium">About</Text>
              <Text as="a" href="#" weight="medium">Diseases</Text>
              <Text as="a" href="#" weight="medium">Contact</Text>
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
                      <Text as="a" href="#" size="3" weight="medium">About</Text>
                      <Text as="a" href="#" size="3" weight="medium">Diseases</Text>
                      <Text as="a" href="#" size="3" weight="medium">Contact</Text>
                    </Flex>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Box>
          </Flex>
        </Container>
      </Box>

      <main>
        {activeTab === 'home' ? (
          <>
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
                      <Button size="3" onClick={() => setActiveTab('detection')}>
                        Scan Now
                      </Button>
                      <Button size="3" variant="outline">
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

            {/* Recent Scans Section */}
            <Section size="3" style={{ backgroundColor: "white" }}>
              <Container size="3">
                <Heading size="6" mb="5">
                  Recent Scans
                </Heading>
                
                <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
                  {[
                    { id: 1, date: 'March 10, 2025', status: 'Diseased', disease: 'Apple Scab' },
                    { id: 2, date: 'March 8, 2025', status: 'Healthy', disease: null },
                    { id: 3, date: 'March 5, 2025', status: 'Healthy', disease: null }
                  ].map((scan) => (
                    <Card key={scan.id}>
                      <Flex direction="column" gap="2">
                        <AspectRatio ratio={4/3}>
                          <Box style={{ backgroundColor: 'var(--gray-3)', borderRadius: 'var(--radius-2)', height: '100%' }} />
                        </AspectRatio>
                        <Heading size="3">Scan #{scan.id}</Heading>
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
                  ))}
                </Grid>
                
                <Flex justify="center" mt="5">
                  <Button variant="soft">
                    View All Scans
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
                      <Button size="2" variant="soft">
                        View Full Plan
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
                    <Button 
                      size="3" 
                      style={{ backgroundColor: 'white', color: 'var(--green-9)' }}
                      onClick={() => setActiveTab('detection')}
                    >
                      New Scan
                    </Button>
                    <Button size="3" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
                      View Alerts
                    </Button>
                  </Flex>
                </Flex>
              </Container>
            </Section>
          </>
        ) : (
          /* Detection Page Content */
          <Section size="3">
            <Container size="2">
              <Flex direction="column" gap="6">
                <Flex justify="between" align="center">
                  <Heading size="6">Leaf Disease Detection</Heading>
                  <Button 
                    variant="soft" 
                    color="gray"
                    onClick={() => setActiveTab('home')}
                  >
                    Back to Dashboard
                  </Button>
                </Flex>
                
                <Card>
                  <Flex direction="column" gap="4">
                    <Text>Upload an image of your apple leaf for AI-powered disease detection.</Text>
                    
                    {error && (
                      <Callout.Root color="red">
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>{error}</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    {!result ? (
                      <Flex direction="column" gap="4">
                        <Box 
                          style={{ 
                            border: '2px dashed var(--gray-5)', 
                            borderRadius: 'var(--radius-3)',
                            padding: '20px',
                            cursor: 'pointer'
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {preview ? (
                            <AspectRatio ratio={4/3}>
                              <img 
                                src={preview} 
                                alt="Leaf preview" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain', 
                                  borderRadius: 'var(--radius-2)' 
                                }} 
                              />
                            </AspectRatio>
                          ) : (
                            <Flex 
                              direction="column" 
                              align="center" 
                              justify="center" 
                              gap="3" 
                              py="9"
                            >
                              <UploadIcon width="32" height="32" color="var(--gray-8)" />
                              <Text align="center">
                                Click to select an image or drag and drop here
                              </Text>
                              <Text size="1" color="gray" align="center">
                                Supports JPG and PNG
                              </Text>
                            </Flex>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                        </Box>
                        
                        <Flex justify="end" gap="3">
                          {preview && (
                            <Button 
                              variant="soft" 
                              color="gray" 
                              onClick={resetForm}
                            >
                              Clear
                            </Button>
                          )}
                          <Button 
                            onClick={handleSubmit} 
                            disabled={!selectedFile || loading}
                          >
                            {loading ? (
                              <Flex gap="2" align="center">
                                <ReloadIcon className="animate-spin" />
                                Analyzing...
                              </Flex>
                            ) : 'Analyze Leaf'}
                          </Button>
                        </Flex>
                      </Flex>
                    ) : (
                      <Flex direction="column" gap="4">
                        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                          <Box>
                            <AspectRatio ratio={4/3}>
                              <img 
                                src={preview!} 
                                alt="Analyzed leaf" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain', 
                                  borderRadius: 'var(--radius-2)' 
                                }} 
                              />
                            </AspectRatio>
                          </Box>
                          
                          <Flex direction="column" gap="3">
                            <Callout.Root color={result.status === 'Healthy' ? 'green' : 'red'}>
                              <Callout.Icon>
                                {result.status === 'Healthy' ? <CheckIcon /> : <ExclamationTriangleIcon />}
                              </Callout.Icon>
                              <Callout.Text>
                                <Flex direction="column" gap="2">
                                  <Text weight="bold" size="5">
                                    {result.status === 'Healthy' 
                                      ? 'Healthy Leaf' 
                                      : result.disease ? `Disease: ${result.disease}` : 'Diseased Leaf'}
                                  </Text>
                                  {result.confidence !== undefined && (
                                    <Flex align="center" gap="2">
                                      <Text size="2">Confidence:</Text>
                                      <Box style={{ 
                                        width: '100%', 
                                        maxWidth: '150px',
                                        height: '8px',
                                        backgroundColor: 'var(--gray-3)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                      }}>
                                        <Box style={{ 
                                          width: `${result.confidence}%`,
                                          height: '100%',
                                          backgroundColor: result.status === 'Healthy' ? 'var(--green-9)' : 'var(--red-9)'
                                        }} />
                                      </Box>
                                      <Text size="2" weight="medium">{Math.round(result.confidence)}%</Text>
                                    </Flex>
                                  )}
                                  {result.advice && (
                                    <Box mt="2" style={{ 
                                      backgroundColor: 'var(--gray-2)', 
                                      padding: '8px 12px', 
                                      borderRadius: 'var(--radius-2)',
                                      border: '1px solid var(--gray-4)'
                                    }}>
                                      <Flex gap="2" align="start">
                                        <Text size="2" weight="bold">Advice:</Text>
                                        <Text size="2">{result.advice}</Text>
                                      </Flex>
                                    </Box>
                                  )}
                                </Flex>
                              </Callout.Text>
                            </Callout.Root>
                          </Flex>
                        </Grid>
                        
                        <Flex justify="end" gap="3">
                          <Button 
                            variant="soft" 
                            onClick={resetForm}
                          >
                            Scan Another Leaf
                          </Button>
                          <Button>
                            Save Report
                          </Button>
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </Card>
              </Flex>
            </Container>
          </Section>
        )}
      </main>
    </Box>
  );
}