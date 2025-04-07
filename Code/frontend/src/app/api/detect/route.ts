import { NextRequest, NextResponse } from 'next/server';

interface DetectionResult {
  status: 'Healthy' | 'Diseased';
  disease: string | null;
  confidence: number;
  advice: string | null;
}

// Map of diseases to treatment advice
const diseaseAdvice: Record<string, string> = {
  'Apple Scab': 'Apply fungicide specifically targeting scab. Remove fallen leaves to reduce spread.',
  'Apple Rust': 'Apply fungicide designed for rust diseases. Remove nearby juniper plants if present.',
  'Healthy': 'Continue regular maintenance and monitoring.'
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { message: 'No image provided' },
        { status: 400 }
      );
    }

    // Accept only image files
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert the file to buffer/arrayBuffer
    const buffer = Buffer.from(await image.arrayBuffer());
    
    // Convert image to base64 for OpenAI API
    const base64Image = buffer.toString('base64');
    
    // Prepare the request to OpenAI API
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };
    
    // Updated prompt for disease classification and confidence
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in apple leaf disease detection. Analyze the apple leaf image and determine if it's healthy or has a specific disease (focus on Apple Scab or Apple Rust). Provide your classification with a confidence score (0-100%)."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Is this apple leaf healthy or diseased? If diseased, identify if it's Apple Scab or Apple Rust. Respond in JSON format with fields: status (Healthy/Diseased), disease (null if healthy, otherwise the disease name), confidence (0-100 as a number)." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300
    };
    
    // Send the request to OpenAI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // Parse the response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }
    
    const data = await response.json();
    
    // Parse the AI response (now in JSON format)
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    // Create the result with appropriate advice
    const result: DetectionResult = {
      status: aiResponse.status,
      disease: aiResponse.disease,
      confidence: aiResponse.confidence,
      advice: aiResponse.status === 'Healthy' 
        ? diseaseAdvice['Healthy'] 
        : diseaseAdvice[aiResponse.disease] || 'Consult with a plant pathologist for treatment options.'
    };

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during processing' },
      { status: 500 }
    );
  }
}

// Handle file size limits
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};