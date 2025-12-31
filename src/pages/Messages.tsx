import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { mockQuickMessages } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageCircle, Edit2, Trash2, Plus, Send, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Messages() {
  const [messages, setMessages] = useState(mockQuickMessages);
  const [editDialog, setEditDialog] = useState<{ open: boolean; message?: typeof messages[0] }>({
    open: false,
  });
  const [newMessage, setNewMessage] = useState({ title: '', content: '' });

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const handleSave = () => {
    if (!newMessage.title || !newMessage.content) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (editDialog.message) {
      setMessages(messages.map(m => 
        m.id === editDialog.message?.id 
          ? { ...m, title: newMessage.title, content: newMessage.content }
          : m
      ));
      toast.success('Message updated');
    } else {
      setMessages([...messages, { 
        id: `qm-${Date.now()}`, 
        title: newMessage.title, 
        content: newMessage.content 
      }]);
      toast.success('Message created');
    }
    
    setEditDialog({ open: false });
    setNewMessage({ title: '', content: '' });
  };

  const handleEdit = (message: typeof messages[0]) => {
    setNewMessage({ title: message.title, content: message.content });
    setEditDialog({ open: true, message });
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    toast.success('Message deleted');
  };

  return (
    <Layout>
      <Header title="Quick Messages" subtitle="Manage your WhatsApp message templates" />
      
      <div className="p-6">
        {/* Add New Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => { setNewMessage({ title: '', content: '' }); setEditDialog({ open: true }); }}>
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Variables Info */}
        <Card className="mb-6 border-primary/20 bg-primary/5 p-4">
          <h4 className="font-medium text-foreground">Available Variables</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Use these placeholders in your messages. They'll be replaced with actual lead data.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['{{name}}', '{{service}}', '{{clinic_name}}', '{{gmb_link}}'].map((variable) => (
              <span
                key={variable}
                className="rounded-md bg-card px-2 py-1 font-mono text-xs text-primary"
              >
                {variable}
              </span>
            ))}
          </div>
        </Card>

        {/* Messages Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((message, index) => (
            <Card
              key={message.id}
              className="animate-fade-in p-4 transition-all duration-200 hover:shadow-medium"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-whatsapp/10">
                    <MessageCircle className="h-4 w-4 text-whatsapp" />
                  </div>
                  <h3 className="font-semibold text-foreground">{message.title}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEdit(message)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">
                {message.content}
              </p>

              <Button
                variant="whatsapp"
                size="sm"
                className="mt-4 w-full"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(message.content)}`, '_blank');
                }}
              >
                <Send className="h-4 w-4" />
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDialog.message ? 'Edit Template' : 'Create Template'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Template Name</Label>
              <Input
                id="title"
                value={newMessage.title}
                onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                placeholder="e.g., Follow-up Reminder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Hi {{name}}, ..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editDialog.message ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
