// tests/api/detect.disease.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/detect/route';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock environment variables
process.env.OPENAI_API_KEY = 'mock-api-key';

// Mock the fetch function
global.fetch = jest.fn();

describe('Leaf Disease Detection API - Disease Detection Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly identify Apple Scab disease', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'scab_leaf.jpg', { type: 'image/jpeg' });
    
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
                confidence: 92.5
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
    expect(responseData.confidence).toBe(92.5);
    expect(responseData.advice).toBe('Apply fungicide specifically targeting scab. Remove fallen leaves to reduce spread.');
  });

  it('should correctly identify Apple Rust disease', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'rust_leaf.jpg', { type: 'image/jpeg' });
    
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
                confidence: 87.3
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
    expect(responseData.confidence).toBe(87.3);
    expect(responseData.advice).toBe('Apply fungicide designed for rust diseases. Remove nearby juniper plants if present.');
  });

  it('should handle unknown disease with default advice', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'unknown_disease.jpg', { type: 'image/jpeg' });
    
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
                disease: 'Unknown Disease',
                confidence: 65.0
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
    expect(responseData.disease).toBe('Unknown Disease');
    expect(responseData.confidence).toBe(65.0);
    expect(responseData.advice).toBe('Consult with a plant pathologist for treatment options.');
  });
});