"use client";

import Navbar from "../components/Navbar";
import { Card } from "@/components/retroui/Card";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="font-head text-5xl font-bold mb-4">💬 Messages</h1>
          <p className="font-head text-xl text-muted-foreground mb-8">
            Coming Soon!
          </p>
          <Card className="max-w-md mx-auto">
            <Card.Content className="p-8">
              <div className="text-6xl mb-4">🚧</div>
              <p className="font-head text-lg">
                This feature is under construction
              </p>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
}

