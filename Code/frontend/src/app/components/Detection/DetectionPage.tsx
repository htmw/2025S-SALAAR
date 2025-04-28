// File: components/Detection/DetectionPage.tsx
// Enhanced with debugging capabilities to track responses
import { useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Heading,
  Button,
  Card,
  Container,
  Section,
  Callout,
  Badge,
} from '@radix-ui/themes';
import {
  ExclamationTriangleIcon,
  ReloadIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { DetectionResult, ScanHistory } from '../../types';
import ImageUpload from './ImageUpload';
import ResultDisplay from './ResultDisplay';

interface DetectionPageProps {
  setActiveTab: (tab: 'home' | 'detection' | 'history') => void;
  scanHistory: ScanHistory[];
  setScanHistory: (history: ScanHistory[]) => void;
}

export default function DetectionPage({ 
  setActiveTab, 
  scanHistory, 
  setScanHistory 
}: DetectionPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{processed: number, total: number}>({processed: 0, total: 0});
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Process a single image and return its result
  const processImage = async (file: File, index: number): Promise<DetectionResult> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Add debug info
      setDebugInfo(prev => [...prev, `Starting analysis of image ${index + 1}: ${file.name}`]);
      
      // Set a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Add a cache-busting parameter to prevent cached responses
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = `API Error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        setDebugInfo(prev => [...prev, `Error analyzing image ${index + 1}: ${errorMessage}`]);
        throw new Error(errorMessage);
      }
      
      const apiResponse = await response.json();
      
      // Add debug info
      setDebugInfo(prev => [...prev, `Received response for image ${index + 1}: ${JSON.stringify(apiResponse)}`]);
      
      // Create a unique result by adding the file index to ensure different results
      // This helps determine if the issue is with the API or the display
      const result: DetectionResult = {
        ...apiResponse,
        // Add extra debug info to visibly differentiate results
        disease: apiResponse.disease ? `${apiResponse.disease} (Image ${index + 1})` : null,
        // Append image number to advice to make it visibly different
        advice: apiResponse.advice ? `${apiResponse.advice} (Result for Image ${index + 1})` : null
      };
      
      return result;
    } catch (err: any) {
      // Add debug info
      setDebugInfo(prev => [...prev, `Exception for image ${index + 1}: ${err.message}`]);
      
      // Rethrow the error to be handled by the caller
      throw new Error(err.message || 'Failed to process image');
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setDebugInfo([]);
    setProcessingStatus({processed: 0, total: selectedFiles.length});
    
    const newResults: DetectionResult[] = [];
    const successfulUploads: {result: DetectionResult, index: number}[] = [];
    
    // Process each image and collect results
    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        const result = await processImage(selectedFiles[i], i);
        
        // Add to results array
        newResults.push(result);
        
        // Track successful uploads
        successfulUploads.push({
          result,
          index: i
        });
      } catch (err: any) {
        console.error(`Error processing image ${i + 1}:`, err);
        
        // Add failed result
        newResults.push({
          status: 'Diseased', // Default to diseased as a precaution
          disease: `Analysis Failed (Image ${i + 1})`,
          confidence: 0,
          advice: `Analysis failed: ${err.message}. Please try again with a clearer image. (Image ${i + 1})`
        });
      }
      
      // Update processing status
      setProcessingStatus({
        processed: i + 1,
        total: selectedFiles.length
      });
    }
    
    // Log for debugging
    console.log('All results:', newResults);
    
    // Update results state
    setResults(newResults);
    
    // Save successful results to history
    if (successfulUploads.length > 0) {
      const newHistoryItems: ScanHistory[] = successfulUploads.map(({result, index}) => ({
        id: `${Date.now()}-${index}`,
        date: new Date().toLocaleString(),
        image: previews[index],
        result: result
      }));
      
      const updatedHistory = [...newHistoryItems, ...scanHistory];
      setScanHistory(updatedHistory);
      
      // Save to local storage
      try {
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to save to local storage:', err);
      }
    }
    
    // Show overall error if all uploads failed
    if (successfulUploads.length === 0 && selectedFiles.length > 0) {
      setError('All image analyses failed. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setResults([]);
    setError(null);
    setDebugInfo([]);
    setProcessingStatus({processed: 0, total: 0});
  };

  return (
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
                  <ImageUpload 
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    previews={previews}
                    setPreviews={setPreviews}
                    maxFiles={5}
                  />
                  
                  <Flex justify="end" gap="3">
                    {selectedFiles.length > 0 && (
                      <Button 
                        variant="soft" 
                        color="gray" 
                        onClick={resetForm}
                      >
                        Clear All
                      </Button>
                    )}
                    <Button 
                      onClick={handleSubmit} 
                      disabled={selectedFiles.length === 0 || loading}
                    >
                      {loading ? (
                        <Flex gap="2" align="center">
                          <ReloadIcon className="animate-spin" />
                          <Text>
                            Processing {processingStatus.processed} of {processingStatus.total}...
                          </Text>
                        </Flex>
                      ) : `Analyze ${selectedFiles.length > 1 ? `${selectedFiles.length} Images` : 'Image'}`}
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Flex direction="column" gap="4">
                  <ResultDisplay results={results} previews={previews} />
                  
                  {/* Debug information section */}
                  {debugInfo.length > 0 && (
                    <Callout.Root color="blue">
                      <Callout.Icon>
                        <InfoCircledIcon />
                      </Callout.Icon>
                      <Callout.Text asChild>
                        <Box>
                          <Text weight="bold" size="2" as="div">Debug Information:</Text>
                          <Box 
                            style={{ 
                              maxHeight: '200px', 
                              overflowY: 'auto',
                              backgroundColor: 'var(--gray-2)',
                              padding: '8px',
                              borderRadius: 'var(--radius-2)',
                              marginTop: '8px'
                            }}
                          >
                            {debugInfo.map((info, i) => (
                              <Text size="1" as="div" key={i} style={{whiteSpace: 'pre-wrap', marginBottom: '4px'}}>
                                {info}
                              </Text>
                            ))}
                          </Box>
                          <Flex justify="between" mt="2">
                            <Badge size="1" variant="soft" color="gray">
                              {results.length} Results
                            </Badge>
                            <Button size="1" variant="soft" color="gray" onClick={() => setDebugInfo([])}>
                              Clear Log
                            </Button>
                          </Flex>
                        </Box>
                      </Callout.Text>
                    </Callout.Root>
                  )}
                  
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
  );
}