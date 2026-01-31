import dotenv from 'dotenv';

dotenv.config();

export const chatWithOpenAI = async (message) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: process.env.GptPrompt + message },
        ],
      }),
    });

    const data = await response.json();
    
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error("Unexpected OpenAI response:", data);
      throw new Error("Invalid response from OpenAI");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

export const getPromptFeedback = async (prompt) => {
  try {
    const message = prompt.message || prompt;
    const response = await chatWithOpenAI(message);
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting prompt feedback:", error);
    throw error;
  }
};
