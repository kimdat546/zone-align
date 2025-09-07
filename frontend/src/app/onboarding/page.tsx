"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface TimeZone {
  label: string;
  value: string;
}

const commonTimezones: TimeZone[] = [
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "Mountain Time (MT)", value: "America/Denver" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "UTC", value: "UTC" },
  { label: "London (GMT)", value: "Europe/London" },
  { label: "Paris (CET)", value: "Europe/Paris" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Sydney (AEDT)", value: "Australia/Sydney" },
  { label: "Mumbai (IST)", value: "Asia/Kolkata" },
];

const workDays = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [profile, setProfile] = useState({
    name: "",
    timezone: "",
    workHours: {
      start: "09:00",
      end: "17:00",
      days: [1, 2, 3, 4, 5], // Mon-Fri
    },
    maxEarlyMeetings: 2,
    maxLateMeetings: 2,
  });

  // Auto-detect timezone and set user name
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setProfile(prev => ({
      ...prev,
      timezone: detectedTimezone,
      name: user?.fullName || user?.firstName || "",
    }));
  }, [user]);

  const handleWorkDayToggle = (day: number) => {
    setProfile(prev => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        days: prev.workHours.days.includes(day)
          ? prev.workHours.days.filter(d => d !== day)
          : [...prev.workHours.days, day].sort(),
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call API to save profile
      console.log("Saving profile:", profile);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ZoneAlign!</h1>
          <p className="mt-2 text-gray-600">Let's set up your profile for optimal team coordination</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your timezone</option>
                    {commonTimezones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!profile.name || !profile.timezone}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Work Schedule</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={profile.workHours.start}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        workHours: { ...prev.workHours, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={profile.workHours.end}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        workHours: { ...prev.workHours, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Work Days
                  </label>
                  <div className="flex space-x-2">
                    {workDays.map(day => (
                      <button
                        key={day.value}
                        onClick={() => handleWorkDayToggle(day.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          profile.workHours.days.includes(day.value)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 px-6 py-2 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Meeting Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Maximum early meetings per week
                    <span className="text-gray-500 text-xs ml-1">(before your work hours)</span>
                  </label>
                  <select
                    value={profile.maxEarlyMeetings}
                    onChange={(e) => setProfile(prev => ({ ...prev, maxEarlyMeetings: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} meetings</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Maximum late meetings per week
                    <span className="text-gray-500 text-xs ml-1">(after your work hours)</span>
                  </label>
                  <select
                    value={profile.maxLateMeetings}
                    onChange={(e) => setProfile(prev => ({ ...prev, maxLateMeetings: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} meetings</option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Fairness Tip:</strong> ZoneAlign will track these preferences and ensure 
                    meeting times are distributed fairly across your team. You can always adjust 
                    these settings later.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 px-6 py-2 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}