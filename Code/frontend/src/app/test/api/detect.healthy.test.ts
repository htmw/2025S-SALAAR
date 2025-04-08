// tests/api/detect.healthy.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/detect/route';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock environment variables
process.env.OPENAI_API_KEY = 'mock-api-key';

// Mock the fetch function
global.fetch = jest.fn();

describe('Leaf Disease Detection API - Healthy Leaf Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly identify a healthy leaf', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'healthy_leaf.jpg', { type: 'image/jpeg' });
    
    // Create a mock form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/detect', {
      method: 'POST',
      body: formData,
    });

    // Mock the OpenAI API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                status: 'Healthy',
                disease: null,
                confidence: 95.8
              })
            }
          }
        ]
      }),
    });

    // Call the API
    const response = await POST(request);
    
    // Assert the response
    expect(response.status).toBe(200);
    
    const responseData = await response.json();
    expect(responseData.status).toBe('Healthy');
    expect(responseData.disease).toBeNull();
    expect(responseData.confidence).toBe(95.8);
    expect(responseData.advice).toBe('Continue regular maintenance and monitoring.');
  });

  it('should handle healthy leaf detection with different confidence levels', async () => {
    // Create test cases with different confidence levels
    const testCases = [
      { confidence: 100, expectedStatus: 'Healthy' },
      { confidence: 85, expectedStatus: 'Healthy' },
      { confidence: 60, expectedStatus: 'Healthy' }
    ];

    for (const testCase of testCases) {
      // Create a mock image file
      const file = new File(['binary-image-data'], 'healthy_leaf.jpg', { type: 'image/jpeg' });
      
      // Create a mock form data
      const formData = new FormData();
      formData.append('image', file);
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/detect', {
        method: 'POST',
        body: formData,
      });

      // Mock the OpenAI API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  status: 'Healthy',
                  disease: null,
                  confidence: testCase.confidence
                })
              }
            }
          ]
        }),
      });

      // Call the API
      const response = await POST(request);
      
      // Assert the response
      expect(response.status).toBe(200);
      
      const responseData = await response.json();
      expect(responseData.status).toBe(testCase.expectedStatus);
      expect(responseData.confidence).toBe(testCase.confidence);
      expect(responseData.advice).toBe('Continue regular maintenance and monitoring.');
    }
  });
});