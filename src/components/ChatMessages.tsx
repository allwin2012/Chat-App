import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import MessageBubble from './MessageBubble';
import DateDivider from './DateDivider';
import { Message } from '../data/mockData';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const messagesByDate: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const dateString = format(date, 'yyyy-MM-dd');

    if (!messagesByDate[dateString]) {
      messagesByDate[dateString] = [];
    }

    messagesByDate[dateString].push(message);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-blue-900/20">
      {Object.keys(messagesByDate).map((dateString) => {
        const messagesForDate = messagesByDate[dateString];

        return (
          <div key={dateString}>
            <DateDivider date={dateString} />

            {messagesForDate.map((message) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                timestamp={message.timestamp}
                isCurrentUser={message.senderId === 'current'}
                status={message.senderId === 'current' ? message.status : undefined}
              />
            ))}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
