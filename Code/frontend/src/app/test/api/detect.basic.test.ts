// tests/api/detect.basic.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/detect/route';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock environment variables
process.env.OPENAI_API_KEY = 'mock-api-key';

// Mock the fetch function
global.fetch = jest.fn();

describe('Leaf Disease Detection API - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when no image is provided', async () => {
    // Create a mock form data with no image
    const formData = new FormData();
    
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/detect', {
      method: 'POST',
      body: formData,
    });

    // Call the API
    const response = await POST(request);
    
    // Assert the response
    expect(response.status).toBe(400);
    
    const responseData = await response.json();
    expect(responseData.message).toBe('No image provided');
  });

  it('should return 400 when non-image file is provided', async () => {
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    // Create a mock form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/detect', {
      method: 'POST',
      body: formData,
    });

    // Call the API
    const response = await POST(request);
    
    // Assert the response
    expect(response.status).toBe(400);
    
    const responseData = await response.json();
    expect(responseData.message).toBe('File must be an image');
  });

  it('should return 500 when OpenAI API request fails', async () => {
    // Create a mock image file
    const file = new File(['binary-image-data'], 'leaf.jpg', { type: 'image/jpeg' });
    
    // Create a mock form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/detect', {
      method: 'POST',
      body: formData,
    });

    // Mock fetch to return an error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'OpenAI API Error' } }),
    });

    // Call the API
    const response = await POST(request);
    
    // Assert the response
    expect(response.status).toBe(500);
    
    const responseData = await response.json();
    expect(responseData.message).toBe('OpenAI API Error');
  });
});