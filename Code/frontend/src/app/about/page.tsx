"use client";

import { 
  Flex, 
  Box, 
  Container, 
  Section, 
  Heading, 
  Text, 
  Card, 
  Grid, 
  AspectRatio, 
  Separator, 
  Avatar, 
  Button 
} from '@radix-ui/themes';
import Link from 'next/link';
import Header from '../components/Layout/Header';

export default function AboutPage() {
  return (
    <Box>
      {/* Header */}
      <Header activeTab="about" setActiveTab={() => {}} />

      {/* Hero Section */}
      <Section size="3" style={{ backgroundColor: 'var(--green-2)' }}>
        <Container size="3">
          <Flex direction="column" align="center" gap="4" py="6">
            <Heading size="8" align="center">About Phytora</Heading>
            <Text size="4" align="center" style={{ maxWidth: '800px' }}>
              Phytora is an innovative AI-powered solution for early detection and 
              management of apple tree diseases, helping farmers protect their crops
              and improve yields.
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Our Mission Section */}
      <Section size="3">
        <Container size="3">
          <Grid columns={{ initial: "1", md: "2" }} gap="8" align="center">
            <Box>
              <AspectRatio ratio={16/9}>
                <Box 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    backgroundColor: 'var(--green-3)',
                    borderRadius: 'var(--radius-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text color="green" weight="bold">Phytora Mission</Text>
                </Box>
              </AspectRatio>
            </Box>
            <Flex direction="column" gap="4" justify="center">
              <Heading size="6">Our Mission</Heading>
              <Text>
                At Phytora, we believe in the power of technology to transform agriculture. 
                Our mission is to use artificial intelligence and computer vision to help farmers 
                detect plant diseases early, reduce pesticide use, and implement sustainable 
                farming practices.
              </Text>
              <Text>
                By providing accessible and accurate disease detection tools, we aim to 
                reduce crop losses and improve food security while promoting environmentally 
                friendly farming methods.
              </Text>
            </Flex>
          </Grid>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section size="3" style={{ backgroundColor: 'white' }}>
        <Container size="3">
          <Flex direction="column" gap="6">
            <Heading size="6" align="center">How Phytora Works</Heading>
            
            <Grid columns={{ initial: "1", sm: "3" }} gap="5">
              <Card>
                <Flex direction="column" gap="3" align="center" p="3">
                  <Box style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--green-3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--green-9)'
                  }}>
                    1
                  </Box>
                  <Heading size="3" align="center">Capture</Heading>
                  <Text align="center">
                    Simply take a photo of the apple leaf you want to analyze 
                    using your smartphone or upload existing images.
                  </Text>
                </Flex>
              </Card>
              
              <Card>
                <Flex direction="column" gap="3" align="center" p="3">
                  <Box style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--green-3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--green-9)'
                  }}>
                    2
                  </Box>
                  <Heading size="3" align="center">Analyze</Heading>
                  <Text align="center">
                    Our AI model analyzes the image to detect signs of diseases
                    like Apple Scab, Rust, and other common pathogens.
                  </Text>
                </Flex>
              </Card>
              
              <Card>
                <Flex direction="column" gap="3" align="center" p="3">
                  <Box style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--green-3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--green-9)'
                  }}>
                    3
                  </Box>
                  <Heading size="3" align="center">Act</Heading>
                  <Text align="center">
                    Receive instant results with disease identification, 
                    confidence score, and actionable treatment recommendations.
                  </Text>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Technology Section */}
      <Section size="3">
        <Container size="2">
          <Flex direction="column" gap="6">
            <Heading size="6">Our Technology</Heading>
            
            <Card>
              <Flex direction="column" gap="4">
                <Text>
                  Phytora leverages cutting-edge artificial intelligence and machine learning to 
                  provide accurate disease detection in apple trees. Our technology combines:
                </Text>
                
                <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                  <Card>
                    <Flex direction="column" gap="2">
                      <Heading size="4">Computer Vision</Heading>
                      <Text>
                        Advanced image recognition algorithms that can identify subtle signs of 
                        disease that might be missed by the human eye.
                      </Text>
                    </Flex>
                  </Card>
                  
                  <Card>
                    <Flex direction="column" gap="2">
                      <Heading size="4">Deep Learning</Heading>
                      <Text>
                        Neural networks trained on thousands of images to accurately classify 
                        different types of plant diseases with high confidence.
                      </Text>
                    </Flex>
                  </Card>
                  
                  <Card>
                    <Flex direction="column" gap="2">
                      <Heading size="4">Real-time Analysis</Heading>
                      <Text>
                        Fast processing that delivers results within seconds, allowing for 
                        immediate action to address detected issues.
                      </Text>
                    </Flex>
                  </Card>
                  
                  <Card>
                    <Flex direction="column" gap="2">
                      <Heading size="4">Treatment Database</Heading>
                      <Text>
                        Comprehensive database of treatment recommendations based on 
                        latest agricultural research and best practices.
                      </Text>
                    </Flex>
                  </Card>
                </Grid>
                
                <Text>
                  Our model continuously improves as more images are processed, making it 
                  more accurate over time and able to adapt to new disease variants.
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Container>
      </Section>

      {/* Team Section */}
      <Section size="3" style={{ backgroundColor: 'white' }}>
        <Container size="3">
          <Flex direction="column" gap="6">
            <Heading size="6" align="center">Meet Our Team</Heading>
            
            <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="5">
              {[
                { name: 'Gopi Krishna Bhookya', role: 'Backend Developer', email: 'gb42904n@pace.edu', avatar: 'G' },
                { name: 'Saipriya Rampudi', role: 'Frontend Developer', email: 'sr14460n@pace.edu', avatar: 'S' },
                { name: 'Naga Karthik Potru', role: 'Machine Learning Engineer', email: 'np98187n@pace.edu', avatar: 'N' },
                { name: 'Manoj Kumar Reddy Mule', role: 'Machine Learning Engineer', email: 'mm99806n@pace.edu', avatar: 'M' },
                { name: 'Nikitha Arpula', role: 'Backend Developer & QA', email: 'na00643n@pace.edu', avatar: 'N' },
                { name: 'Krishna Kishore Varma Kalidindi', role: 'Backend Developer', email: 'kk87857n@pace.edu', avatar: 'K' },
                { name: 'Nagalakshmi Narra', role: 'Frontend Developer', email: 'nn99484n@pace.edu', avatar: 'N' },
                { name: 'Paul Morales', role: 'Frontend Developer', email: 'pm15633n@pace.edu', avatar: 'P' }
              ].map((member, i) => (
                <Card key={i}>
                  <Flex direction="column" align="center" gap="3" p="3">
                    <Avatar 
                      size="5" 
                      fallback={member.avatar} 
                      color="green" 
                      radius="full"
                    />
                    <Flex direction="column" align="center">
                      <Text weight="bold">{member.name}</Text>
                      <Text size="2" color="gray">{member.role}</Text>
                      <Text size="2" color="gray">{member.email}</Text>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section size="3" style={{ backgroundColor: 'var(--green-9)' }}>
        <Container size="3">
          <Flex justify="between" align="center" direction={{ initial: 'column', sm: 'row' }} gap="4">
            <Heading size="6" style={{ color: 'white' }}>
              Have Questions?
            </Heading>
            <Flex gap="3">
              <Button 
                size="3" 
                style={{ backgroundColor: 'white', color: 'var(--green-9)' }}
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button 
                size="3" 
                variant="outline" 
                style={{ borderColor: 'white', color: 'white' }}
              >
                <Link href="/faq">FAQ</Link>
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Footer */}
      <Box style={{ backgroundColor: 'var(--gray-1)', borderTop: '1px solid var(--gray-4)' }}>
        <Container size="3">
          <Flex justify="between" align="center" py="5" direction={{ initial: 'column', sm: 'row' }} gap="4">
            <Flex align="center" gap="2">
              <Avatar fallback="P" color="green" size="2" />
              <Text size="2" weight="bold">Phytora</Text>
            </Flex>
            
            <Text size="1" color="gray">
              © {new Date().getFullYear()} Phytora. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}