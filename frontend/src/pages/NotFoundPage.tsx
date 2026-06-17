import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen dashboard-bg flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-9xl font-black text-black mb-6">404</h1>
      <p className="text-xl text-neutral-600 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="dashboard-btn-primary px-8 py-3 rounded-full font-bold">
        Return Home
      </Link>
    </div>
  );
}
