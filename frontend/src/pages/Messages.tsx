import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageCircle, Edit2, Trash2, Plus, Send, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/api';

interface Template {
  id: number;
  name: string;
  content: string;
  template_type: string;
}

export default function Messages() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<{ open: boolean; template?: Template }>({ open: false });
  const [newMessage, setNewMessage] = useState({ title: '', content: '' });

  const fetchTemplates = async () => {
    try {
      const data = await apiFetch('/api/whatsapp/templates');
      setTemplates(data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Fallback to empty
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const handleSave = async () => {
    if (!newMessage.title || !newMessage.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editDialog.template) {
        await apiFetch(`/api/whatsapp/templates/${editDialog.template.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: newMessage.title, content: newMessage.content }),
        });
        toast.success('Template updated');
      } else {
        await apiFetch('/api/whatsapp/templates', {
          method: 'POST',
          body: JSON.stringify({
            name: newMessage.title,
            content: newMessage.content,
            template_type: 'quick_message',
          }),
        });
        toast.success('Template created');
      }
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save template');
    }

    setEditDialog({ open: false });
    setNewMessage({ title: '', content: '' });
  };

  const handleEdit = (template: Template) => {
    setNewMessage({ title: template.name, content: template.content });
    setEditDialog({ open: true, template });
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/api/whatsapp/templates/${id}`, { method: 'DELETE' });
      toast.success('Template deleted');
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete template');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Header title="Quick Messages" subtitle="Manage your WhatsApp message templates" />
        <div className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
              <span key={variable} className="rounded-md bg-card px-2 py-1 font-mono text-xs text-primary">
                {variable}
              </span>
            ))}
          </div>
        </Card>

        {/* Messages Grid */}
        {templates.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-muted-foreground">No templates yet. Create your first one!</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <Card
                key={template.id}
                className="animate-fade-in p-4 transition-all duration-200 hover:shadow-medium"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-whatsapp/10">
                      <MessageCircle className="h-4 w-4 text-whatsapp" />
                    </div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => copyToClipboard(template.content)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(template)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">
                  {template.content}
                </p>

                <Button
                  variant="whatsapp"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(template.content)}`, '_blank');
                  }}
                >
                  <Send className="h-4 w-4" />
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDialog.template ? 'Edit Template' : 'Create Template'}</DialogTitle>
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
            <Button variant="outline" onClick={() => setEditDialog({ open: false })}>Cancel</Button>
            <Button onClick={handleSave}>{editDialog.template ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
