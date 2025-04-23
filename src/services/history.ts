import { Conversation, Message } from '../types';
import { nanoid } from 'nanoid';

export async function saveConversation(conversation: Conversation): Promise<void> {
  try {
    // Create date-based folder structure
    const date = new Date();
    const folderPath = `/history/response/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    // Ensure directory exists (would be handled server-side in a real app)
    await ensureDirectoryExists(folderPath);
    
    // Filename with conversation ID
    const filename = `${folderPath}/user-agent-chat-${conversation.id}.json`;
    
    // In a browser environment, we'll simulate saving by using localStorage
    // In a real app, this would make a fetch request to a server endpoint
    const allConversations = getConversationsFromLocalStorage();
    const updatedConversations = allConversations.map(conv => 
      conv.id === conversation.id ? conversation : conv
    );
    
    // If conversation doesn't exist, add it
    if (!allConversations.some(conv => conv.id === conversation.id)) {
      updatedConversations.push(conversation);
    }
    
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

export function getConversationsFromLocalStorage(): Conversation[] {
  const storedConversations = localStorage.getItem('conversations');
  return storedConversations ? JSON.parse(storedConversations) : [];
}

export function getConversationById(id: string): Conversation | null {
  const conversations = getConversationsFromLocalStorage();
  return conversations.find(conv => conv.id === id) || null;
}

export function createNewConversation(model: string = 'microsoft/mai-ds-r1:free'): Conversation {
  const now = Date.now();
  return {
    id: nanoid(),
    title: 'New conversation',
    messages: [],
    model,
    createdAt: now,
    updatedAt: now
  };
}

export function deleteConversation(id: string): void {
  const conversations = getConversationsFromLocalStorage().filter(
    conv => conv.id !== id
  );
  localStorage.setItem('conversations', JSON.stringify(conversations));
}

// This is a simulation function since we can't create directories in the browser
// In a real app, this would be handled by server-side code
async function ensureDirectoryExists(path: string): Promise<void> {
  // Just a stub function that would make a server request in a real app
  console.log(`Ensuring directory exists: ${path}`);
  return Promise.resolve();
}