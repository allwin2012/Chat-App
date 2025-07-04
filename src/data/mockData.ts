import { format } from 'date-fns';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  lastSeen: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}

// Generate users
export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Living the dream ✨',
    online: true,
    lastSeen: 'now',
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'At the gym 💪',
    online: false,
    lastSeen: '10 minutes ago',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'Working remotely 💻',
    online: true,
    lastSeen: 'now',
    unreadCount: 5,
  },
  {
    id: '4',
    name: 'Diana Miller',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'On vacation 🏝️',
    online: false,
    lastSeen: '2 hours ago',
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Tech Friends',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'Group chat for tech enthusiasts',
    online: true,
    lastSeen: 'now',
    unreadCount: 12,
  },
  {
    id: '6',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'Busy with work 🚫',
    online: false,
    lastSeen: '3 days ago',
    unreadCount: 0,
  },
  {
    id: '7',
    name: 'Frank Anderson',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'Available for coffee ☕',
    online: true,
    lastSeen: 'now',
    unreadCount: 1,
  }
];

// Current user (you)
export const currentUser: User = {
  id: 'current',
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?img=8',
  status: 'Available',
  online: true,
  lastSeen: 'now',
  unreadCount: 0,
};

// Helper function to create message timestamps
const createMessageTime = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

// Generate messages
const generateMessages = (userId: string): Message[] => {
  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 15) + 5; // 5-20 messages
  
  for (let i = 0; i < messageCount; i++) {
    const isFromUser = Math.random() > 0.5;
    const minutesAgo = messageCount - i + Math.floor(Math.random() * 5);
    const timestamp = createMessageTime(minutesAgo);
    
    messages.push({
      id: `msg-${userId}-${i}`,
      senderId: isFromUser ? 'current' : userId,
      receiverId: isFromUser ? userId : 'current',
      text: getRandomMessage(isFromUser, userId),
      timestamp: timestamp,
      status: getRandomStatus(),
      isRead: minutesAgo > 60, // Messages older than an hour are read
    });
  }
  
  // Sort messages by timestamp (oldest first)
  return messages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Random message content
const getRandomMessage = (isFromUser: boolean, userId: string): string => {
  const userMessages = [
    "Hey there! How's it going?",
    "I was thinking about that project we discussed",
    "Did you see the news today?",
    "Can we meet up later?",
    "Thanks for your help yesterday!",
    "I'm running late, sorry!",
    "What do you think about this idea?",
    "Have you tried that new restaurant downtown?",
    "Just checking in 😊",
    "Remember to send me those files when you get a chance",
    "Happy Friday! 🎉",
    "How was your weekend?",
    "I'll be there in 10 minutes",
    "Can you help me with something?",
    "Let me know when you're free to talk"
  ];
  
  const contactMessages = [
    "Not bad, how about you?",
    "Yeah, we should discuss that further",
    "I did! It's pretty concerning",
    "Sure, when works for you?",
    "No problem at all!",
    "No worries, take your time",
    "Sounds interesting! Tell me more",
    "Not yet, is it good?",
    "All good here! 👍",
    "Will do that tonight",
    "You too! Any plans?",
    "It was great! Went hiking ⛰️",
    "See you soon!",
    "Of course, what's up?",
    "I'm available now if you want to chat"
  ];
  
  // Special messages for group chat
  if (userId === '5') {
    if (isFromUser) {
      return userMessages[Math.floor(Math.random() * userMessages.length)];
    } else {
      const groupMembers = ["Alice", "Bob", "Charlie", "Diana"];
      const randomMember = groupMembers[Math.floor(Math.random() * groupMembers.length)];
      return `[${randomMember}] ${contactMessages[Math.floor(Math.random() * contactMessages.length)]}`;
    }
  }
  
  return isFromUser 
    ? userMessages[Math.floor(Math.random() * userMessages.length)]
    : contactMessages[Math.floor(Math.random() * contactMessages.length)];
};

// Random message status
const getRandomStatus = (): 'sent' | 'delivered' | 'read' => {
  const statuses: ('sent' | 'delivered' | 'read')[] = ['sent', 'delivered', 'read'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Generate chats
export const generateChats = (): Chat[] => {
  return users.map(user => {
    const messages = generateMessages(user.id);
    return {
      id: `chat-${user.id}`,
      participants: [user.id, 'current'],
      messages: messages,
      lastMessage: messages[messages.length - 1]
    };
  });
};

// Format a date for display
export const formatMessageDate = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (messageDate.toDateString() === today.toDateString()) {
    return format(messageDate, 'h:mm a'); // Today: "3:45 PM"
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return format(messageDate, 'MMM d'); // "Jul 4"
  }
};

// Format time only
export const formatMessageTime = (timestamp: string): string => {
  return format(new Date(timestamp), 'h:mm a');
};

// Get a chat by user ID
export const getChatByUserId = (userId: string, chats: Chat[]): Chat | undefined => {
  return chats.find(chat => chat.participants.includes(userId));
};

// Get a user by ID
export const getUserById = (userId: string): User | undefined => {
  if (userId === 'current') return currentUser;
  return users.find(user => user.id === userId);
};

// Sort chats by most recent message
export const sortChatsByRecent = (chats: Chat[]): Chat[] => {
  return [...chats].sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
    return bTime - aTime;
  });
};

// Initial chats data
export const initialChats = generateChats();
