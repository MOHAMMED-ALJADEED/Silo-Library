import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Mail, User, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_date"),
  });

  // The admin UI shell is gated on a server-verified, RLS-protected response.
  // A spoofed client-side role cannot pass this check — only the backend can.
  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access denied</h2>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">All contact form submissions</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="w-4 h-4 text-primary" />
                    {msg.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    {msg.email}
                  </span>
                </div>
                {msg.created_date && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(msg.created_date), "MMM d, yyyy · h:mm a")}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/40 rounded-lg p-4">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}