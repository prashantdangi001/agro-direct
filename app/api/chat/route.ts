import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // We now accept the language preference from the frontend
    const { message, language } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "System Error: API Key missing." }, { status: 500 });
    }

    // ✨ Updated System Prompt for Voice & Language
    const khetifyContext = `You are Khetify AI, a friendly and expert agricultural assistant in India. 
    You help farmers with crop management, market pricing, weather, and platform listings.
    
    CRITICAL RULES:
    1. You MUST reply ONLY in ${language}.
    2. Keep your answers conversational, polite, and very concise (1-3 sentences max).
    3. DO NOT use any markdown formatting (no asterisks, no hashtags, no bold text) because your response will be read aloud by a Text-to-Speech engine. Use plain text only.
    
    The farmer says: "${message}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: khetifyContext }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", data);
      return NextResponse.json({ reply: `API Error. Please check terminal.` });
    }
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "मुझे खेद है, मुझे समझ नहीं आया। (Sorry, I didn't understand.)";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ reply: "सर्वर त्रुटि। कृपया बाद में प्रयास करें। (Server error. Please try later.)" }, { status: 500 });
  }
}