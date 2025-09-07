import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join ZoneAlign</h1>
          <p className="mt-2 text-gray-600">Create your account and start coordinating with your team</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}