import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing phone number or message' }, { status: 400 });
    }

    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;

    if (!instanceId || !token) {
      console.error("Missing UltraMsg Environment Variables");
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }

    // UltraMsg requires x-www-form-urlencoded data
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
    const formData = new URLSearchParams();
    formData.append("token", token);
    
    // Format: UltraMsg requires the country code but NO '+' sign
    formData.append("to", to); 
    formData.append("body", message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("UltraMsg API Error:", data);
      return NextResponse.json({ error: data.error || 'Failed to send message' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}