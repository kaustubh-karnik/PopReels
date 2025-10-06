"use client";

import Navbar from "../components/Navbar";
import { Card } from "@/components/retroui/Card";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="font-head text-5xl font-bold mb-4">👤 Profile</h1>
          <p className="font-head text-xl text-muted-foreground mb-8">
            {session?.user?.email || "User Profile"}
          </p>
          <Card className="max-w-md mx-auto">
            <Card.Content className="p-8">
              <div className="text-6xl mb-4">⚙️</div>
              <p className="font-head text-lg">
                Profile management coming soon
              </p>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
}

