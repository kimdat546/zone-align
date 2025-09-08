"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  timezone: string;
  avatar?: string;
  status: "online" | "offline" | "away";
}

// Mock data - replace with real data from API
const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Alice Johnson", timezone: "America/New_York", status: "online" },
  { id: "2", name: "Bob Smith", timezone: "Europe/London", status: "away" },
  { id: "3", name: "Carol Davis", timezone: "Asia/Tokyo", status: "online" },
  { id: "4", name: "David Wilson", timezone: "America/Los_Angeles", status: "offline" },
];

function WorldClock({ member }: { member: TeamMember }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: member.timezone,
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [member.timezone]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-accent-500";
      case "away": return "bg-yellow-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border hover:shadow-medium transition-all">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700">
              {member.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
        </div>
        <div>
          <p className="font-semibold text-text-primary">{member.name}</p>
          <p className="text-sm text-text-secondary">{member.timezone.replace("_", " ")}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-xl font-bold text-text-primary">{time}</p>
        <p className="text-sm text-text-tertiary capitalize">{member.status}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-border-light shadow-soft">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <span className="text-2xl font-bold text-text-primary">ZoneAlign</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl hover:bg-surface-secondary transition-all">
                Teams
              </button>
              <button className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl hover:bg-surface-secondary transition-all">
                Meetings
              </button>
              <button className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl hover:bg-surface-secondary transition-all">
                Analytics
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
            🌍 Global Team Dashboard
          </div>
          <h1 className="text-4xl font-bold text-text-primary">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-3 text-xl text-text-secondary">
            Here's your team's live status and intelligent scheduling insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team World Clock */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-large p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">Live Team Status</h2>
                  <p className="text-text-secondary mt-1">Real-time timezone coordination</p>
                </div>
                <button className="gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-medium transition-all transform hover:scale-105 font-semibold">
                  🚀 Schedule Meeting
                </button>
              </div>
              
              <div className="space-y-4">
                {mockTeamMembers.map(member => (
                  <WorldClock key={member.id} member={member} />
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-primary-50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-1">💡 Smart Insight</h3>
                    <p className="text-primary-800">Best meeting window: 2:00-3:00 PM UTC with 80% team availability</p>
                  </div>
                  <button className="text-primary-700 hover:text-primary-900 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meetings attended</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Early meetings</span>
                  <span className="font-semibold text-green-600">2/2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Late meetings</span>
                  <span className="font-semibold text-yellow-600">1/2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fairness score</span>
                  <span className="font-semibold text-blue-600">Good</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-left">
                  + Schedule Meeting
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 text-left">
                  📊 View Analytics
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 text-left">
                  👥 Invite Team Member
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 text-left">
                  ⚙️ Team Settings
                </button>
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Team Standup</p>
                  <p className="text-blue-600 text-sm">Tomorrow, 9:00 AM</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Project Review</p>
                  <p className="text-gray-600 text-sm">Friday, 2:00 PM</p>
                </div>
                <div className="text-center pt-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View all meetings →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}