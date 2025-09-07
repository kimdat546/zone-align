import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ZoneAlign</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link 
              href="/sign-in" 
              className="text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stop Fighting Time Zones,<br />
            <span className="text-blue-600">Start Coordinating Smartly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ZoneAlign uses AI to create fair meeting schedules across time zones, 
            preventing burnout and optimizing your team's async workflows.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <SignedOut>
              <Link 
                href="/sign-up" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all"
              >
                Start Free Trial
              </Link>
              <Link 
                href="#features" 
                className="text-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:text-gray-900"
              >
                Learn More
              </Link>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Features Preview */}
        <div id="features" className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Scheduling</h3>
            <p className="text-gray-600">AI-powered rotation ensures no one always gets the 6 AM or 11 PM meetings.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Burnout Prevention</h3>
            <p className="text-gray-600">Track meeting burden and get alerts before team members become overloaded.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coordination</h3>
            <p className="text-gray-600">See your entire team's local times and optimal async handoff windows.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
