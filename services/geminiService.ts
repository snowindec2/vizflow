import { GoogleGenAI, Type } from "@google/genai";
import { Priority, Task, TaskStatus } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a task title/description and returns suggested subtasks, priority, and tags.
 */
export const analyzeTaskWithAI = async (taskTitle: string, taskDescription: string): Promise<{
  subtasks: string[];
  priority: Priority;
  tags: string[];
}> => {
  try {
    const prompt = `Analyze this task: Title: "${taskTitle}", Description: "${taskDescription}". Break it down into actionable subtasks, suggest a priority level, and suggest 3 relevant short tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable subtasks"
            },
            priority: {
              type: Type.STRING,
              enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
              description: "Suggested priority level"
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of max 3 related tags"
            }
          },
          required: ["subtasks", "priority", "tags"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Fallback if parsing fails or returns empty
    return {
      subtasks: result.subtasks || [],
      priority: (result.priority as Priority) || Priority.MEDIUM,
      tags: result.tags || []
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      subtasks: ["Review requirements", "Plan execution"],
      priority: Priority.MEDIUM,
      tags: ["general"]
    };
  }
};

/**
 * Generates a weekly progress report based on completed tasks.
 */
export const generateWeeklyReport = async (tasks: Task[]): Promise<string> => {
  try {
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE);
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);

    if (completedTasks.length === 0 && inProgressTasks.length === 0) {
      return "No tasks to report on yet.";
    }

    const taskSummary = `
      Completed Tasks: ${completedTasks.map(t => t.title).join(", ")}
      In Progress Tasks: ${inProgressTasks.map(t => t.title).join(", ")}
      Total Tasks: ${tasks.length}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a professional, concise weekly status report summary (max 100 words) based on this data: ${taskSummary}. Focus on achievements and current focus. Use Markdown formatting.`,
    });

    return response.text || "Could not generate report.";

  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Error generating report. Please try again.";
  }
};
