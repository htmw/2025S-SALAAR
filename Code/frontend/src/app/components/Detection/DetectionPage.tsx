mport { useState, useRef } from 'react';
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
import ImagePreview from './ImagePreview';
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
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                  <ImagePreview 
                    previews={previews}
                    currentPreviewIndex={currentPreviewIndex}
                    setCurrentPreviewIndex={setCurrentPreviewIndex}
                    fileInputRef={fileInputRef}
                  />
                  
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
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
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