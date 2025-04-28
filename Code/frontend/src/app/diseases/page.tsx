"use client";

import { useState } from 'react';
import { 
  Flex, 
  Box, 
  Container, 
  Section, 
  Heading, 
  Text, 
  Card, 
  Grid, 
  Tabs, 
  Button
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Header from '../components/Layout/Header';

// Disease interface
interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  management: string[];
}

export default function DiseasesPage() {
  // Disease data
  const diseases: Disease[] = [
    {
      id: 'apple-scab',
      name: 'Apple Scab',
      symptoms: [
        'Olive-green or brown spots on leaves',
        'Dark, scabby lesions on fruit',
        'Premature leaf drop'
      ],
      management: [
        'Apply fungicide specifically targeting scab',
        'Remove fallen leaves to reduce spread',
        'Prune trees to improve air circulation',
        'Plant scab-resistant varieties'
      ]
    },
    {
      id: 'apple-rust',
      name: 'Apple Rust',
      symptoms: [
        'Bright orange-yellow spots on leaves',
        'Orange projections on leaf undersides',
        'Reduced fruit quality'
      ],
      management: [
        'Apply fungicide designed for rust diseases',
        'Remove nearby juniper plants if present',
        'Plant rust-resistant apple varieties'
      ]
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Header activeTab="diseases" setActiveTab={() => {}} />

      {/* Hero Section */}
      <Section size="3" style={{ backgroundColor: 'var(--green-2)' }}>
        <Container size="3">
          <Flex direction="column" align="center" gap="3" py="5">
            <Heading size="6" align="center">Common Apple Leaf Diseases</Heading>
            <Text align="center">
              Learn about the symptoms and treatments for common apple tree diseases.
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Diseases Tab Section */}
      <Section size="3">
        <Container size="3">
          <Tabs.Root defaultValue="apple-scab">
            <Tabs.List>
              {diseases.map((disease) => (
                <Tabs.Trigger key={disease.id} value={disease.id}>
                  {disease.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {diseases.map((disease) => (
              <Tabs.Content key={disease.id} value={disease.id}>
                <Card my="4">
                  <Flex direction="column" gap="4">
                    <Heading size="5">{disease.name}</Heading>
                    
                    <Box>
                      <Text weight="bold">Symptoms:</Text>
                      <Flex direction="column" gap="1" mt="1">
                        {disease.symptoms.map((symptom, index) => (
                          <Flex key={index} gap="2" align="center">
                            <Box style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--green-9)'
                            }} />
                            <Text size="2">{symptom}</Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                    
                    <Box>
                      <Text weight="bold">Management:</Text>
                      <Flex direction="column" gap="1" mt="1">
                        {disease.management.map((item, index) => (
                          <Flex key={index} gap="2" align="center">
                            <Box style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--green-9)'
                            }} />
                            <Text size="2">{item}</Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                    
                    <Flex justify="end">
                      <Button
                        size="2"
                        color="green"
                        asChild
                      >
                        <Link href="/detection">Scan Your Leaves</Link>
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Container>
      </Section>

      {/* Footer */}
      <Box style={{ backgroundColor: 'var(--green-9)', color: 'white' }}>
        <Container size="3">
          <Flex justify="center" align="center" py="4">
            <InfoCircledIcon style={{ marginRight: '8px' }} />
            <Text size="2">
              Early detection is key to preventing disease spread.
              <Link href="/detection" style={{ marginLeft: '8px', color: 'white', textDecoration: 'underline' }}>
                Scan leaves now
              </Link>
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}