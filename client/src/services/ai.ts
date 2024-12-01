
// import { getOpenAIInstance } from '../lib/openai';
// import type { CreateTaskInput } from '../types/task';

// export interface AISuggestion extends CreateTaskInput {}

// export const aiService = {
//   async generateTaskSuggestions(prompt: string): Promise<AISuggestion[]> {
//     try {
//       const openai = getOpenAIInstance();
//       const completion = await openai.chat.completions.create({
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a helpful task management assistant. Generate task suggestions based on user input.',
//           },
//           { role: 'user', content: prompt },
//         ],
//         model: 'gpt-3.5-turbo',
//         functions: [
//           {
//             name: 'generate_tasks',
//             parameters: {
//               type: 'object',
//               properties: {
//                 tasks: {
//                   type: 'array',
//                   items: {
//                     type: 'object',
//                     properties: {
//                       title: { type: 'string' },
//                       description: { type: 'string' },
//                       dueDate: { type: 'string', format: 'date' },
//                       status: {
//                         type: 'string',
//                         enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
//                         default: 'PENDING',
//                       },
//                     },
//                     required: ['title'],
//                   },
//                 },
//               },
//               required: ['tasks'],
//             },
//           },
//         ],
//         function_call: { name: 'generate_tasks' },
//       });

//       const functionCall = completion.choices[0].message.function_call;
//       if (!functionCall?.arguments) {
//         throw new Error('Failed to generate task suggestions');
//       }

//       const { tasks } = JSON.parse(functionCall.arguments);
//       return tasks;
//     } catch (error) {
//       console.error('Error generating task suggestions:', error);
//       throw new Error('Failed to generate task suggestions. Please try again.');
//     }
//   },

//   async summarizeTaskDescription(description: string): Promise<string> {
//     try {
//       const openai = getOpenAIInstance();
//       const completion = await openai.chat.completions.create({
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a helpful assistant that summarizes task descriptions concisely.',
//           },
//           {
//             role: 'user',
//             content: `Please summarize this task description in a concise way: ${description}`,
//           },
//         ],
//         model: 'gpt-3.5-turbo',
//         max_tokens: 100,
//       });

//       return completion.choices[0].message.content || '';
//     } catch (error) {
//       console.error('Error summarizing task description:', error);
//       throw new Error('Failed to summarize task description. Please try again.');
//     }
//   },

//   async processNaturalLanguageCommand(
//     command: string
//   ): Promise<AISuggestion | null> {
//     try {
//       const openai = getOpenAIInstance();
//       const completion = await openai.chat.completions.create({
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a helpful task management assistant. Convert natural language commands into structured task data.',
//           },
//           { role: 'user', content: command },
//         ],
//         model: 'gpt-3.5-turbo',
//         functions: [
//           {
//             name: 'create_task',
//             parameters: {
//               type: 'object',
//               properties: {
//                 title: { type: 'string' },
//                 description: { type: 'string' },
//                 dueDate: { type: 'string', format: 'date' },
//                 status: {
//                   type: 'string',
//                   enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
//                   default: 'PENDING',
//                 },
//               },
//               required: ['title'],
//             },
//           },
//         ],
//         function_call: { name: 'create_task' },
//       });

//       const functionCall = completion.choices[0].message.function_call;
//       if (!functionCall?.arguments) {
//         return null;
//       }

//       return JSON.parse(functionCall.arguments);
//     } catch (error) {
//       console.error('Error processing natural language command:', error);
//       throw new Error('Failed to process command. Please try again.');
//     }
//   },
// };

import { getOpenAIInstance } from '../lib/openai';
import type { CreateTaskInput } from '../types/task';

export interface AISuggestion extends CreateTaskInput {}

export const aiService = {
  async generateTaskSuggestions(prompt: string): Promise<AISuggestion[]> {
    try {
      const openai = getOpenAIInstance();
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful task management assistant. Generate task suggestions based on user input.',
          },
          { role: 'user', content: prompt },
        ],
        model: 'gpt-3.5-turbo',
        functions: [
          {
            name: 'generate_tasks',
            parameters: {
              type: 'object',
              properties: {
                tasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      dueDate: { type: 'string', format: 'date' }, // Expect ISO 8601 date format
                      status: {
                        type: 'string',
                        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
                        default: 'PENDING',
                      },
                      userId: { type: 'string' }, // Added userId as a required field
                    },
                    required: ['title', 'userId'], // Mark title and userId as required
                  },
                },
              },
              required: ['tasks'],
            },
          },
        ],
        function_call: { name: 'generate_tasks' },
      });

      const functionCall = completion.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Failed to generate task suggestions');
      }

      const { tasks } = JSON.parse(functionCall.arguments);

      // Validate and format the results before returning
      return tasks.map((task: AISuggestion) => ({
        ...task,
        dueDate: task.dueDate ? this.formatDate(task.dueDate) : null, // Format `dueDate` if necessary
        userId: this.getUserId(), // Ensure `userId` is present
      }));
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      throw new Error('Failed to generate task suggestions. Please try again.');
    }
  },

  formatDate(date: string): string | null {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split('T')[0];
  },

  getUserId(): string {
    // Replace this with actual logic to fetch the authenticated user's ID
    const userId = 'authenticated_user_id'; // Example placeholder
    if (!userId) throw new Error('User ID is required but not provided');
    return userId;
  },

  async processNaturalLanguageCommand(
    command: string
  ): Promise<AISuggestion | null> {
    try {
      const openai = getOpenAIInstance();
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful task management assistant. Convert natural language commands into structured task data.',
          },
          { role: 'user', content: command },
        ],
        model: 'gpt-3.5-turbo',
        functions: [
          {
            name: 'create_task',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                dueDate: { type: 'string', format: 'date' },
                status: {
                  type: 'string',
                  enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
                  default: 'PENDING',
                },
                userId: { type: 'string' }, // Ensure userId is included
              },
              required: ['title', 'userId'], // userId is now required
            },
          },
        ],
        function_call: { name: 'create_task' },
      });

      const functionCall = completion.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        return null;
      }

      const task = JSON.parse(functionCall.arguments);
      task.dueDate = this.formatDate(task.dueDate); // Format the dueDate
      task.userId = this.getUserId(); // Ensure `userId` is populated

      return task;
    } catch (error) {
      console.error('Error processing natural language command:', error);
      throw new Error('Failed to process command. Please try again.');
    }
  },
};

