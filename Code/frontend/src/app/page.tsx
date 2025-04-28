"use client";

import { useState, useRef, useEffect } from 'react';
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
  Callout,
  Tabs,
  Badge,
  ScrollArea
} from '@radix-ui/themes';
import {
  LightningBoltIcon,
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  HamburgerMenuIcon,
  ExclamationTriangleIcon,
  UploadIcon,
  ReloadIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';

interface DetectionResult {
  status: 'Healthy' | 'Diseased';
  disease: string | null;
  confidence: number;
  advice: string | null;
}

interface ScanHistory {
  id: string;
  date: string;
  image: string;
  result: DetectionResult;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Disease detection state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI section state
  const [activeTab, setActiveTab] = useState<'home' | 'detection' | 'history'>('home');
  
  // History state
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const itemsPerPage = 6;

  // Load scan history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convert FileList to array and limit to 5 files
    const fileArray = Array.from(files).slice(0, 5);
    
    // Validate each file
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    let hasInvalidFile = false;
    
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        hasInvalidFile = true;
        return;
      }
      validFiles.push(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (hasInvalidFile) {
      setError('One or more files are not images. Only image files are accepted.');
    } else {
      setError(null);
    }
    
    setSelectedFiles(validFiles);
    setResults([]);
    setCurrentPreviewIndex(0);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    const newResults: DetectionResult[] = [];

    try {
      // Process each file sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('image', selectedFiles[i]);

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
        newResults.push(data);
      }
      
      setResults(newResults);
      
      // Save to scan history in local storage
      const newHistoryItems: ScanHistory[] = newResults.map((result, index) => ({
        id: Date.now() + '-' + index,
        date: new Date().toLocaleString(),
        image: previews[index],
        result: result
      }));
      
      const updatedHistory = [...newHistoryItems, ...scanHistory];
      setScanHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setResults([]);
    setError(null);
    setCurrentPreviewIndex(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const deleteScanHistory = (id: string) => {
    const updatedHistory = scanHistory.filter(item => item.id !== id);
    setScanHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };
  
  const clearAllHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scanHistory');
  };
  
  // Convert recent scans for display on home page
  const recentScans = scanHistory.slice(0, 3).map(scan => ({
    id: scan.id,
    date: new Date(scan.date).toLocaleDateString(),
    status: scan.result.status,
    disease: scan.result.disease,
    image: scan.image
  }));

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
              <Text as="a" href="#" 
                onClick={() => setActiveTab('history')} 
                weight="medium"
                color={activeTab === 'history' ? "green" : undefined}
                style={{ cursor: 'pointer' }}
              >
                History
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

            {/* Recent Scans Section */}
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
          </>
        ) : activeTab === 'detection' ? (
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
                    <Text>Upload images of your apple leaves for AI-powered disease detection. You can upload up to 5 images at once.</Text>
                    
                    {error && (
                      <Callout.Root color="red">
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>{error}</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    {selectedFiles.length === 0 || results.length === 0 ? (
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
                          {previews.length > 0 ? (
                            <Flex direction="column" gap="4">
                              <AspectRatio ratio={4/3}>
                                <img 
                                  src={previews[currentPreviewIndex]} 
                                  alt={`Leaf preview ${currentPreviewIndex + 1}`} 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain', 
                                    borderRadius: 'var(--radius-2)' 
                                  }} 
                                />
                              </AspectRatio>
                              
                              {previews.length > 1 && (
                                <Flex justify="between" align="center">
                                  <Button 
                                    variant="soft" 
                                    color="gray" 
                                    size="1"
                                    disabled={currentPreviewIndex === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentPreviewIndex(prev => Math.max(0, prev - 1));
                                    }}
                                  >
                                    <ChevronLeftIcon />
                                  </Button>
                                  <Text size="2" color="gray">
                                    {currentPreviewIndex + 1} of {previews.length}
                                  </Text>
                                  <Button 
                                    variant="soft"
                                    color="gray" 
                                    size="1"
                                    disabled={currentPreviewIndex === previews.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentPreviewIndex(prev => Math.min(previews.length - 1, prev + 1));
                                    }}
                                  >
                                    <ChevronRightIcon />
                                  </Button>
                                </Flex>
                              )}
                            </Flex>
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
                                Click to select images or drag and drop here
                              </Text>
                              <Text size="1" color="gray" align="center">
                                Supports JPG and PNG (up to 5 images)
                              </Text>
                            </Flex>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                          />
                        </Box>
                        
                        <Flex justify="end" gap="3">
                          {previews.length > 0 && (
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
                            disabled={selectedFiles.length === 0 || loading}
                          >
                            {loading ? (
                              <Flex gap="2" align="center">
                                <ReloadIcon className="animate-spin" />
                                Analyzing...
                              </Flex>
                            ) : `Analyze ${selectedFiles.length > 1 ? `${selectedFiles.length} Leaves` : 'Leaf'}`}
                          </Button>
                        </Flex>
                      </Flex>
                    ) : (
                      <Flex direction="column" gap="4">
                        <Tabs.Root defaultValue="0">
                          <Tabs.List>
                            {results.map((_, index) => (
                              <Tabs.Trigger key={index} value={index.toString()}>
                                Leaf {index + 1}
                              </Tabs.Trigger>
                            ))}
                          </Tabs.List>
                          
                          {results.map((result, index) => (
                            <Tabs.Content key={index} value={index.toString()}>
                              <Grid columns={{ initial: "1", sm: "2" }} gap="4" mt="4">
                                <Box>
                                  <AspectRatio ratio={4/3}>
                                    <img 
                                      src={previews[index]} 
                                      alt={`Analyzed leaf ${index + 1}`} 
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
                            </Tabs.Content>
                          ))}
                        </Tabs.Root>
                        
                        <Flex justify="end" gap="3">
                          <Button 
                            variant="soft" 
                            onClick={resetForm}
                          >
                            Scan More Leaves
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('history')}
                          >
                            View All Records
                          </Button>
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </Card>
              </Flex>
            </Container>
          </Section>
        ) : (
          /* History Page Content */
          <Section size="3">
            <Container size="2">
              <Flex direction="column" gap="6">
                <Flex justify="between" align="center">
                  <Heading size="6">Scan History</Heading>
                  <Flex gap="3">
                    <Button 
                      variant="soft" 
                      color="gray"
                      onClick={() => setActiveTab('home')}
                    >
                      Back to Dashboard
                    </Button>
                    <Button 
                      variant="soft" 
                      color="red"
                      onClick={clearAllHistory}
                      disabled={scanHistory.length === 0}
                    >
                      Clear All
                    </Button>
                  </Flex>
                </Flex>
                
                <Card>
                  {scanHistory.length > 0 ? (
                    <Flex direction="column" gap="4">
                      <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
                        {scanHistory
                          .slice(historyPage * itemsPerPage, (historyPage + 1) * itemsPerPage)
                          .map((scan) => (
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
                        ))}
                      </Grid>
                      
                      {/* Pagination */}
                      {Math.ceil(scanHistory.length / itemsPerPage) > 1 && (
                        <Flex justify="center" gap="2" mt="4">
                          <Button 
                            size="1" 
                            variant="soft" 
                            disabled={historyPage === 0}
                            onClick={() => setHistoryPage(p => Math.max(0, p - 1))}
                          >
                            <ChevronLeftIcon /> Previous
                          </Button>
                          <Text size="2" style={{ display: 'flex', alignItems: 'center' }}>
                            Page {historyPage + 1} of {Math.ceil(scanHistory.length / itemsPerPage)}
                          </Text>
                          <Button 
                            size="1" 
                            variant="soft"
                            disabled={historyPage >= Math.ceil(scanHistory.length / itemsPerPage) - 1}
                            onClick={() => setHistoryPage(p => Math.min(Math.ceil(scanHistory.length / itemsPerPage) - 1, p + 1))}
                          >
                            Next <ChevronRightIcon />
                          </Button>
                        </Flex>
                      )}
                      
                      <Flex justify="center" mt="2">
                        <Button 
                          onClick={() => setActiveTab('detection')}
                        >
                          Start New Scan
                        </Button>
                      </Flex>
                    </Flex>
                  ) : (
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
                  )}
                </Card>
              </Flex>
            </Container>
          </Section>
        )}
      </main>
    </Box>
  );
}