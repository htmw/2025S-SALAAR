import { useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Button,
  AspectRatio,
} from '@radix-ui/themes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UploadIcon,
} from '@radix-ui/react-icons';

interface ImagePreviewProps {
  previews: string[];
  currentPreviewIndex: number;
  setCurrentPreviewIndex: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function ImagePreview({
  previews,
  currentPreviewIndex,
  setCurrentPreviewIndex,
  fileInputRef,
}: ImagePreviewProps) {
  return (
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
                  setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1));
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
                  setCurrentPreviewIndex(Math.min(previews.length - 1, currentPreviewIndex + 1));
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
    </Box>
  );
}
