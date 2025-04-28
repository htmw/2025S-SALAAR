// File: components/Detection/DetectionPage.tsx
// Production implementation with robust error handling
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
} from '@radix-ui/themes';
import {
  ExclamationTriangleIcon,
  ReloadIcon,
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

  // Process a single image and return its result
  const processImage = async (file: File): Promise<DetectionResult> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Set a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
        signal: controller.signal
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
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (err: any) {
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
    setProcessingStatus({processed: 0, total: selectedFiles.length});
    
    const newResults: DetectionResult[] = [];
    const successfulUploads: {result: DetectionResult, index: number}[] = [];
    
    // Process each image and collect results
    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        const result = await processImage(selectedFiles[i]);
        
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
          disease: 'Analysis Failed',
          confidence: 0,
          advice: `Analysis failed: ${err.message}. Please try again with a clearer image.`
        });
      }
      
      // Update processing status
      setProcessingStatus({
        processed: i + 1,
        total: selectedFiles.length
      });
    }
    
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