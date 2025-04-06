import { NextApiRequest, NextApiResponse } from "next";

interface ChatbotResponse {
  response: string;
}

interface ApiError {
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatbotResponse | ApiError>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.query as { message?: string };

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const lowerMessage = message.toLowerCase();
    let response: string;

    if (
      lowerMessage.includes("project") ||
      lowerMessage.includes("detail") ||
      lowerMessage.includes("info")
    ) {
      response =
        "For project details or more info, kindly contact me at +447553828941 or md.kamran@devrolin.com!";
    } else {
      response = `You asked: '${message}'. I’m here to talk about Muhammad Kamran’s portfolio—his projects, skills, or how to reach him. What’s on your mind?`;
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error in chatbot:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `Error in chatbot: ${errorMessage}` });
  }
}