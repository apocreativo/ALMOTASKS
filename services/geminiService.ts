import { GoogleGenAI, Type } from "@google/genai";

// As per guidelines, API key is from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateSubtasks(taskTitle: string): Promise<{ title: string }[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the task title "${taskTitle}", generate a list of 3 to 5 subtasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              description: 'List of subtasks.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'The title of the subtask.',
                  },
                },
                required: ['title'],
              },
            },
          },
          required: ['subtasks'],
        },
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    
    if (result.subtasks && Array.isArray(result.subtasks)) {
      return result.subtasks.map((sub: any) => ({ title: sub.title }));
    }
    return [];
  } catch (error) {
    console.error("Error generating subtasks with Gemini:", error);
    // Return empty array or throw error, depending on desired error handling
    return [];
  }
}
