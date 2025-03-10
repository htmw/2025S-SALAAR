import { NextRequest, NextResponse } from 'next/server';

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
    
    // Prepare the curl-style request to OpenAI API
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };
    
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in apple leaf disease detection. Your only task is to determine if an apple leaf is healthy or diseased. You should respond with ONLY 'Healthy' or 'Diseased' and nothing else."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Is this apple leaf healthy or diseased? Respond with ONLY 'Healthy' or 'Diseased'." 
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
      max_tokens: 10
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
    
    // Extract just the 'Healthy' or 'Diseased' response
    const aiResponse = data.choices[0].message.content.trim();
    
    // Return a simple result object
    const result = {
      status: aiResponse === "Healthy" ? "Healthy" : "Diseased"
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