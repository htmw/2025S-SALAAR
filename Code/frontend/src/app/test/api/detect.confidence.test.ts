// tests/api/detect.confidence.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/detect/route';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock environment variables
process.env.OPENAI_API_KEY = 'mock-api-key';

// Mock the fetch function
global.fetch = jest.fn();

describe('Leaf Disease Detection API - Confidence Score Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle high confidence disease detection (90-100%)', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'high_conf_scab.jpg', { type: 'image/jpeg' });
    
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
                status: 'Diseased',
                disease: 'Apple Scab',
                confidence: 98.2
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
    expect(responseData.status).toBe('Diseased');
    expect(responseData.disease).toBe('Apple Scab');
    expect(responseData.confidence).toBe(98.2);
    expect(responseData.confidence).toBeGreaterThanOrEqual(90);
    expect(responseData.confidence).toBeLessThanOrEqual(100);
  });

  it('should handle medium confidence disease detection (70-89%)', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'medium_conf_rust.jpg', { type: 'image/jpeg' });
    
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
                status: 'Diseased',
                disease: 'Apple Rust',
                confidence: 78.5
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
    expect(responseData.status).toBe('Diseased');
    expect(responseData.disease).toBe('Apple Rust');
    expect(responseData.confidence).toBe(78.5);
    expect(responseData.confidence).toBeGreaterThanOrEqual(70);
    expect(responseData.confidence).toBeLessThanOrEqual(89);
  });

  it('should handle low confidence disease detection (below 70%)', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'low_conf.jpg', { type: 'image/jpeg' });
    
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
                status: 'Diseased',
                disease: 'Apple Scab',
                confidence: 62.1
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
    expect(responseData.status).toBe('Diseased');
    expect(responseData.disease).toBe('Apple Scab');
    expect(responseData.confidence).toBe(62.1);
    expect(responseData.confidence).toBeLessThan(70);
  });

  it('should handle edge case confidence values', async () => {
    // Test cases for edge case confidence values
    const testCases = [
      { confidence: 100, disease: 'Apple Scab' },    // Max confidence
      { confidence: 0, disease: 'Apple Rust' },      // Zero confidence
      { confidence: 50, disease: 'Apple Scab' }      // Borderline confidence
    ];

    for (const testCase of testCases) {
      // Create a mock image file
      const file = new File(['binary-image-data'], 'edge_case.jpg', { type: 'image/jpeg' });
      
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
                  status: 'Diseased',
                  disease: testCase.disease,
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
      expect(responseData.status).toBe('Diseased');
      expect(responseData.disease).toBe(testCase.disease);
      expect(responseData.confidence).toBe(testCase.confidence);
    }
  });
});