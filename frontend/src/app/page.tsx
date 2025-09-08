"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Demo team members for visualization
const demoTeamMembers = [
  { name: "Alex Chen", timezone: "America/Los_Angeles", avatar: "AC", status: "online", meeting: false },
  { name: "Sarah Johnson", timezone: "America/New_York", avatar: "SJ", status: "away", meeting: true },
  { name: "Marcus Weber", timezone: "Europe/Berlin", avatar: "MW", status: "online", meeting: false },
  { name: "Priya Patel", timezone: "Asia/Mumbai", avatar: "PP", status: "offline", meeting: false },
  { name: "Kenji Tanaka", timezone: "Asia/Tokyo", avatar: "KT", status: "online", meeting: false },
];

function LiveWorldClock() {
  const [times, setTimes] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      demoTeamMembers.forEach(member => {
        const now = new Date();
        newTimes[member.timezone] = now.toLocaleTimeString("en-US", {
          timeZone: member.timezone,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit"
        });
      });
      setTimes(newTimes);
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-accent-500";
      case "away": return "bg-yellow-400";
      default: return "bg-gray-400";
    }
  };

  const getTimeColor = (timezone: string) => {
    const hour = new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit"
    });
    const h = parseInt(hour);
    if (h >= 9 && h < 17) return "text-accent-600"; // Work hours
    if (h >= 6 && h < 9) return "text-yellow-600"; // Early
    if (h >= 17 && h < 22) return "text-orange-500"; // Evening
    return "text-red-500"; // Late night
  };

  return (
    <div className="bg-white rounded-2xl shadow-large p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Live Team Status</h3>
        <div className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
          5 members
        </div>
      </div>
      
      <div className="space-y-4">
        {demoTeamMembers.map((member, index) => (
          <div 
            key={member.name}
            className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl hover:bg-surface-tertiary transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">{member.avatar}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                {member.meeting && (
                  <div className="absolute -top-1 -left-1 h-4 w-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-text-primary">{member.name}</p>
                <p className="text-sm text-text-secondary">{member.timezone.split('/')[1]}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-mono text-lg font-bold ${getTimeColor(member.timezone)}`}>
                {times[member.timezone] || "00:00"}
              </p>
              <p className="text-xs text-text-tertiary capitalize">{member.status}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-primary-50 rounded-xl">
        <p className="text-sm text-primary-800">
          <span className="font-semibold">💡 Smart Insight:</span> Best meeting window is 
          <span className="font-semibold text-primary-700"> 2:00-3:00 PM UTC</span> with 80% team availability
        </p>
      </div>
    </div>
  );
}

function FairnessTracker() {
  const fairnessData = [
    { name: "Alex", early: 1, late: 2, score: 92 },
    { name: "Sarah", early: 3, late: 0, score: 85 },
    { name: "Marcus", early: 0, late: 1, score: 98 },
    { name: "Priya", early: 2, late: 3, score: 78 },
    { name: "Kenji", early: 1, late: 1, score: 95 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-large p-8 animate-slide-up">
      <h3 className="text-xl font-semibold text-text-primary mb-6">Fairness Tracker</h3>
      <div className="space-y-4">
        {fairnessData.map((member, index) => (
          <div key={member.name} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-center">
              <span className="font-medium text-text-primary">{member.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">{member.score}%</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  member.score >= 90 ? 'bg-accent-100 text-accent-700' :
                  member.score >= 80 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {member.score >= 90 ? 'Great' : member.score >= 80 ? 'Good' : 'Needs balance'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <span>Early: {member.early}</span>
              <span>•</span>
              <span>Late: {member.late}</span>
            </div>
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  member.score >= 90 ? 'bg-accent-500' :
                  member.score >= 80 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${member.score}%`, animationDelay: `${index * 200}ms` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-accent-50 rounded-xl">
        <p className="text-sm text-accent-800">
          <span className="font-semibold">🎯 Next Action:</span> Schedule Sarah for a later slot to improve balance
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState(0);
  const demos = ['worldclock', 'fairness', 'scheduling'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-2xl font-bold text-text-primary">ZoneAlign</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</Link>
              <Link href="#demo" className="text-text-secondary hover:text-text-primary transition-colors">Demo</Link>
              <Link href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href="/sign-up" 
                  className="gradient-primary text-white px-6 py-2.5 rounded-xl hover:shadow-medium transition-all transform hover:scale-105 font-medium"
                >
                  Get started
                </Link>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-primary-50/30 to-surface">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
                🚀 AI-Powered Fair Scheduling
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
                Never Fight
                <br />
                <span className="text-primary-600">Time Zones</span>
                <br />
                Again
              </h1>
              
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                ZoneAlign intelligently distributes meeting burden across your global team, 
                preventing burnout while maximizing collaboration effectiveness.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <SignedOut>
                  <Link 
                    href="/sign-up" 
                    className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-large transition-all transform hover:scale-105 text-center"
                  >
                    Start Free Trial
                  </Link>
                  <Link 
                    href="#demo" 
                    className="border-2 border-primary-200 text-primary-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all text-center"
                  >
                    See It in Action
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link 
                    href="/dashboard" 
                    className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-large transition-all transform hover:scale-105 text-center"
                  >
                    Go to Dashboard
                  </Link>
                </SignedIn>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">94%</div>
                  <div className="text-sm text-text-secondary">Less Meeting Fatigue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-500">3.5h</div>
                  <div className="text-sm text-text-secondary">Saved Per Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">87%</div>
                  <div className="text-sm text-text-secondary">Better Balance</div>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-accent-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative">
                {activeDemo === 0 && <LiveWorldClock />}
                {activeDemo === 1 && <FairnessTracker />}
                {activeDemo === 2 && (
                  <div className="bg-white rounded-2xl shadow-large p-8">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">AI Scheduling Assistant</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary-50 rounded-xl">
                        <p className="text-sm text-primary-800">
                          🤖 "I found 3 optimal time slots for your team standup, ensuring fair distribution..."
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 border-2 border-accent-500 rounded-xl text-center">
                          <div className="text-sm font-medium text-accent-700">Option 1</div>
                          <div className="text-xs text-text-secondary">2:00 PM UTC</div>
                          <div className="text-xs text-accent-600">87% fair</div>
                        </div>
                        <div className="p-3 border border-border rounded-xl text-center">
                          <div className="text-sm font-medium">Option 2</div>
                          <div className="text-xs text-text-secondary">9:00 AM UTC</div>
                          <div className="text-xs text-yellow-600">72% fair</div>
                        </div>
                        <div className="p-3 border border-border rounded-xl text-center">
                          <div className="text-sm font-medium">Option 3</div>
                          <div className="text-xs text-text-secondary">6:00 PM UTC</div>
                          <div className="text-xs text-red-600">64% fair</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Demo Navigation */}
              <div className="flex justify-center mt-6 space-x-2">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDemo(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeDemo ? 'bg-primary-600' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Built for Global Teams
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Every feature designed to eliminate timezone chaos and create fair, 
              productive meetings for distributed teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-medium hover:shadow-large transition-shadow animate-fade-in">
              <div className="h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Smart Fair Scheduling</h3>
              <p className="text-text-secondary leading-relaxed">
                AI analyzes everyone's meeting history to ensure no one gets stuck with 
                all the early morning or late night calls. True fairness, automatically.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-medium hover:shadow-large transition-shadow animate-fade-in" style={{animationDelay: '200ms'}}>
              <div className="h-16 w-16 gradient-accent rounded-2xl flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Burnout Prevention</h3>
              <p className="text-text-secondary leading-relaxed">
                Real-time tracking of meeting burden with proactive alerts when team 
                members are approaching their inconvenience limits.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-medium hover:shadow-large transition-shadow animate-fade-in" style={{animationDelay: '400ms'}}>
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Live Global View</h3>
              <p className="text-text-secondary leading-relaxed">
                See everyone's current local time, work status, and availability at a glance. 
                Find the perfect async handoff windows instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
