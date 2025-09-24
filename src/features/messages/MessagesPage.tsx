import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  ArrowUpRight as Sent, 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  Reply,
  Forward,
  Trash2,
  Star,
  Circle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Message, User } from '@/types';
import { formatDate, formatDateTime } from '@/utils/date';
import { useAuthStore } from '@/stores/authStore';

const MessagesPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipients: '',
    subject: '',
    body: '',
    type: 'direct' as 'direct' | 'announce'
  });

  useEffect(() => {
    fetchMessages();
  }, [selectedTab]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?type=${selectedTab === 'sent' ? 'sent' : 'inbox'}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data || []);
      } else {
        // Use fallback data from fixtures
        const { default: fallbackMessages } = await import('@/fixtures/messages.json');
        setMessages(fallbackMessages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Use fallback data
      import('@/fixtures/messages.json').then(data => setMessages(data.default || []));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH'
      });
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, readBy: [...msg.readBy, user?.id || ''] }
          : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: composeForm.subject,
          body: composeForm.body,
          recipients: composeForm.recipients.split(',').map(r => r.trim()),
          type: composeForm.type
        })
      });

      if (response.ok) {
        setComposeForm({ recipients: '', subject: '', body: '', type: 'direct' });
        setSelectedTab('sent');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMessageRead = (message: Message) => {
    return user ? message.readBy.includes(user.id) : false;
  };

  const renderMessageList = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMessages.map((message) => {
            const isRead = isMessageRead(message);
            return (
              <div
                key={message.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : isRead 
                      ? 'border-gray-200 bg-white' 
                      : 'border-blue-200 bg-blue-50/30'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!isRead) markAsRead(message.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!isRead && <Circle className="h-2 w-2 text-blue-500 fill-current flex-shrink-0" />}
                      <h3 className={`text-sm ${isRead ? 'font-medium' : 'font-semibold'} truncate`}>
                        {message.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        message.type === 'announce' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.type === 'announce' ? 'Announcement' : 'Direct'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.body}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(message.createdAt)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMessageDetail = () => {
    if (!selectedMessage) {
      return (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>Select a message to read</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{selectedMessage.title}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              <Button variant="outline" size="sm">
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </Button>
              <Button variant="outline" size="icon">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>From: System</span>
            <span>To: {selectedMessage.recipients.length} recipients</span>
            <span>{formatDateTime(selectedMessage.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCompose = () => (
    <form onSubmit={sendMessage} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Recipients</label>
          <Input
            placeholder="Enter recipient IDs (comma-separated)"
            value={composeForm.recipients}
            onChange={(e) => setComposeForm(prev => ({ ...prev, recipients: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            value={composeForm.type}
            onChange={(e) => setComposeForm(prev => ({ ...prev, type: e.target.value as 'direct' | 'announce' }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="direct">Direct Message</option>
            <option value="announce">Announcement</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <Input
            placeholder="Message subject"
            value={composeForm.subject}
            onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            placeholder="Write your message..."
            value={composeForm.body}
            onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => setSelectedTab('inbox')}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
    </form>
  );

  const tabs = [
    { id: 'inbox' as const, label: t('messages.inbox'), icon: Inbox },
    { id: 'sent' as const, label: t('messages.outbox'), icon: Sent },
    { id: 'compose' as const, label: t('messages.compose'), icon: Send }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Communicate with students, teachers, and staff
        </p>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 pr-6">
          <div className="space-y-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={selectedTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {selectedTab !== 'compose' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedTab === 'inbox' ? 'Inbox' : 'Sent Messages'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {renderMessageList()}
              </CardContent>
            </Card>
          )}

          {selectedTab === 'compose' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compose Message</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCompose()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 pl-6">
          {selectedTab === 'compose' ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>Use the compose form on the left to send a new message</p>
              </div>
            </div>
          ) : (
            renderMessageDetail()
          )}
        </div>
      </div>
    </div>
  );
};

export { MessagesPage as Component };