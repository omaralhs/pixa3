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
          { role: "user", content: message },
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

export const translateToEnglish = async (text) => {
  try {
    const message = `Translate the following text to English. If it's already in English, return it unchanged. Return ONLY the translated text, no explanations, no extra words, no phrases like "Here is" or "Sure". Just the translation:\n\n"${text}"`;
    
    const response = await chatWithOpenAI(message);
    // Trim any quotes or extra whitespace
    return response.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Error translating text:", error);
    // If translation fails, return original text
    return text;
  }
};

export const getPromptFeedback = async (userPrompt, targetPrompt) => {
  try {
    // Build the complete message with target and user prompts
    const fullMessage = process.env.GptPrompt + targetPrompt + '"\n\nUser prompt: "' + userPrompt + '"';
    
    const response = await chatWithOpenAI(fullMessage);
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting prompt feedback:", error);
    throw error;
  }
};
