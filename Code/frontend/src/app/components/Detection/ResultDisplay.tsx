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
  
  interface ResultDisplayProps {
    results: DetectionResult[];
    previews: string[];
  }
  
  export default function ResultDisplay({ results, previews }: ResultDisplayProps) {
    return (
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
    );
  }
  