import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message");

  if (!message) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  try {
    const lowerMessage = message.toLowerCase();
    let response: string;

    if (
      lowerMessage.includes("project") ||
      lowerMessage.includes("detail") ||
      lowerMessage.includes("info")
    ) {
      response = "For project details or more info, kindly contact me at +447553828941 or md.kamran@devrolin.com!";
    } else {
      response = `You asked: '${message}'. I’m here to talk about Muhammad Kamran’s portfolio—his projects, skills, or how to reach him. What’s on your mind?`;
    }

    return NextResponse.json({ response }, {
      headers: {
        "Access-Control-Allow-Origin": "https://md-portfolio-inky.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: unknown) {
    console.error("Error in chatbot:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: `Error in chatbot: ${errorMessage}` }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "https://md-portfolio-inky.vercel.app",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}