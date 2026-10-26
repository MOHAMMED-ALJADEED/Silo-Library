import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Mail, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.ContactMessage.create(form);
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    toast({ title: "Message sent!", description: "Thank you for your feedback." });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            Have feedback, suggestions, or questions? We'd love to hear from you.
          </p>
        </div>

        {sent ?
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-accent mx-auto flex items-center justify-center mb-5">
              <CheckCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your message has been sent successfully.
            </p>
            <Button onClick={() => setSent(false)} variant="outline">
              Send Another Message
            </Button>
          </div> :

        <div className="bg-card rounded-2xl border border-border p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Send us a message</h2>
                <p className="text-xs text-muted-foreground">We typically respond within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required />
                
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required />
                
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your feedback or suggestions..."
                className="min-h-[140px]"
                required />
              
              </div>
              <Button type="submit" disabled={sending} className="w-full h-11 rounded-lg">
                {sending ?
              <span className="flex items-center gap-2">Sending...</span> :

              <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
              }
              </Button>
            </form>
          </div>
        }
      </div>
    </div>);

}