import {
    Flex,
    Box,
    Text,
    Grid,
    AspectRatio,
    Callout,
    Tabs,
  } from '@radix-ui/themes';
  import {
    CheckIcon,
    ExclamationTriangleIcon,
  } from '@radix-ui/react-icons';
  import { DetectionResult } from '../../types';
  import { useState, useEffect } from 'react';
  
  interface ResultDisplayProps {
    results: DetectionResult[];
    previews: string[];
  }
  
  export default function ResultDisplay({ results, previews }: ResultDisplayProps) {
    const [selectedTab, setSelectedTab] = useState("0");
    
    // Ensure we're displaying the correct data for each tab
    useEffect(() => {
      console.log(`Selected tab: ${selectedTab}`);
      console.log(`Results for this tab:`, results[parseInt(selectedTab)]);
    }, [selectedTab, results]);
  
    return (
      <Tabs.Root defaultValue="0" onValueChange={setSelectedTab}>
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
                <Text size="2" weight="medium" align="center" mt="2">
                  Leaf Image {index + 1}
                </Text>
              </Box>
              
              <Box>
                <Callout.Root color={result.status === 'Healthy' ? 'green' : 'red'}>
                  <Callout.Icon>
                    {result.status === 'Healthy' ? <CheckIcon /> : <ExclamationTriangleIcon />}
                  </Callout.Icon>
                  <Callout.Text asChild>
                    <Box>
                      <Text weight="bold" size="5" as="div">
                        {result.status === 'Healthy' 
                          ? 'Healthy Leaf' 
                          : result.disease ? `Disease: ${result.disease}` : 'Diseased Leaf'}
                      </Text>
                      
                      {result.confidence !== undefined && (
                        <Box mt="2">
                          <Text size="2" as="div">Confidence: {Math.round(result.confidence)}%</Text>
                          <Box mt="1" style={{ 
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
                        </Box>
                      )}
                      
                      {result.advice && (
                        <Box mt="2" style={{ 
                          backgroundColor: 'var(--gray-2)', 
                          padding: '8px 12px', 
                          borderRadius: 'var(--radius-2)',
                          border: '1px solid var(--gray-4)'
                        }}>
                          <Text size="2" weight="bold" as="div">Advice:</Text>
                          <Text size="2" as="div">{result.advice}</Text>
                        </Box>
                      )}
                    </Box>
                  </Callout.Text>
                </Callout.Root>
              </Box>
            </Grid>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    );
  }