import { useState, useRef } from 'react';
import {
  Flex,
  Box,
  Text,
  Button,
  Card,
  AspectRatio,
} from '@radix-ui/themes';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  Cross2Icon,
  UploadIcon,
} from '@radix-ui/react-icons';

interface ImageUploadProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  previews: string[];
  setPreviews: (previews: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ 
  selectedFiles, 
  setSelectedFiles, 
  previews, 
  setPreviews,
  maxFiles = 5 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Remove a specific image from the selection
  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };
  
  // Add more images to the selection
  const handleAddMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check how many more files we can add
    const remainingSlots = maxFiles - selectedFiles.length;
    if (remainingSlots <= 0) return;
    
    // Convert FileList to array and limit to remaining slots
    const fileArray = Array.from(files).slice(0, remainingSlots);
    
    // Validate each file
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      validFiles.push(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setSelectedFiles([...selectedFiles, ...validFiles]);
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset the input field so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Open file selector
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <Box>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAddMoreImages}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
      
      {/* Image grid */}
      <Box mb="4">
        {previews.length > 0 ? (
          <Flex direction="column" gap="4">
            <Text size="2" color="gray">
              {selectedFiles.length} of {maxFiles} images selected
            </Text>
            
            <Flex 
              wrap="wrap" 
              gap="3"
              css={{ 
                '@media (max-width: 520px)': { 
                  flexDirection: 'column'
                } 
              }}
            >
              {/* Existing images */}
              {previews.map((preview, index) => (
                <Box 
                  key={index} 
                  style={{ 
                    position: 'relative',
                    width: '100%',
                    maxWidth: '150px',
                    borderRadius: 'var(--radius-2)',
                    overflow: 'hidden'
                  }}
                >
                  <AspectRatio ratio={1/1}>
                    <img 
                      src={preview} 
                      alt={`Leaf preview ${index + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                      }} 
                    />
                  </AspectRatio>
                  
                  {/* Remove button */}
                  <Button
                    size="1"
                    variant="solid"
                    color="gray"
                    style={{ 
                      position: 'absolute', 
                      top: '5px', 
                      right: '5px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <Cross2Icon />
                  </Button>
                </Box>
              ))}
              
              {/* Add more button (if under max limit) */}
              {selectedFiles.length < maxFiles && (
                <Box 
                  style={{ 
                    width: '100%',
                    maxWidth: '150px',
                    border: '2px dashed var(--gray-5)', 
                    borderRadius: 'var(--radius-2)',
                    cursor: 'pointer'
                  }}
                  onClick={triggerFileSelect}
                >
                  <AspectRatio ratio={1/1}>
                    <Flex 
                      direction="column" 
                      align="center" 
                      justify="center" 
                      style={{ height: '100%' }}
                    >
                      <PlusIcon width="24" height="24" color="var(--gray-8)" />
                      <Text size="1" align="center" color="gray" mt="2">
                        Add More
                      </Text>
                    </Flex>
                  </AspectRatio>
                </Box>
              )}
            </Flex>
          </Flex>
        ) : (
          <Box 
            style={{ 
              border: '2px dashed var(--gray-5)', 
              borderRadius: 'var(--radius-3)',
              padding: '20px',
              cursor: 'pointer'
            }}
            onClick={triggerFileSelect}
          >
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
                Supports JPG and PNG (up to {maxFiles} images)
              </Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}
