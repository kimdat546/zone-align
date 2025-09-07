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
      case "online": return "bg-green-400";
      case "away": return "bg-yellow-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">
              {member.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
        </div>
        <div>
          <p className="font-medium text-gray-900">{member.name}</p>
          <p className="text-sm text-gray-500">{member.timezone.replace("_", " ")}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-lg font-semibold text-gray-900">{time}</p>
        <p className="text-sm text-gray-500 capitalize">{member.status}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ZoneAlign</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                Teams
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                Meetings
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your team's current status across time zones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team World Clock */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Team World Clock</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Schedule Meeting
                </button>
              </div>
              
              <div className="space-y-4">
                {mockTeamMembers.map(member => (
                  <WorldClock key={member.id} member={member} />
                ))}
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