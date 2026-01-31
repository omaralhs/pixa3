import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

export const generateImage = async (prompt) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    const taskUUID = uuidv4();

    const requestBody = [
      {
        taskType: "authentication",
        apiKey: process.env.RUNWARE_API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: "39d7207a-87ef-4c93-8082-1431f9c1dc97",
        positivePrompt: prompt,
        width: 1024,
        height: 1024,
        steps: 50,
        model: "runware:101@1",
        checkNSFW: true,
        numberResults: 1
      }
    ];

    const response = await axios.post("https://api.runware.ai/v1", requestBody, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const imageURL = response.data?.data?.[0]?.imageURL;
    
    if (!imageURL) {
      throw new Error("No image returned from Runware");
    }

    return imageURL;
  } catch (err) {
    console.error("Runware API error:", err.message);
    throw new Error("Image generation failed");
  }
};
