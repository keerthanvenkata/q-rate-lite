import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitFeedback, type FeedbackResponse } from '../api';
import { Star, Coffee } from 'lucide-react';

export default function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [optIn, setOptIn] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="dashboard-bg flex items-center justify-center p-4">
        <div className="dashboard-card p-6 text-center max-w-md w-full">
          <p className="text-neutral-600">Invalid or missing session token. Please re-scan the QR code.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating to continue.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await submitFeedback({ token, rating, comment: comment.trim() || undefined, marketing_opt_in: optIn });
      setResult(data);
      if (data.redirect_url) {
        // Option 1 Logic: Brief toast/message, then redirect to Google
        setTimeout(() => {
          window.location.href = data.redirect_url as string;
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="dashboard-bg flex flex-col items-center justify-center p-4">
        <div className="dashboard-card p-8 text-center max-w-md w-full animate-fade-in">
          <div className="w-16 h-16 bg-neutral-100 text-black rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200">
            <Coffee size={32} />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Thank you!</h2>
          <p className="text-neutral-600 mb-6">{result.message}</p>
          
          {result.redirect_url && (
            <p className="text-sm text-neutral-500 animate-pulse">Redirecting you to Google...</p>
          )}

          {!result.redirect_url && result.coupon_code && (
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mt-4">
               <p className="text-sm font-semibold text-black uppercase tracking-wider mb-1">Your Next Visit Coupon</p>
               <p className="text-3xl font-mono tracking-widest text-black">{result.coupon_code}</p>
               <p className="text-xs text-neutral-500 mt-2">Show this to the staff on your next visit.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg flex flex-col items-center p-4 pt-12">
      <div className="max-w-md w-full">
        {/* Dynamic header could go here based on cafe info from token verification */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tight">How was your visit?</h1>
          <p className="text-neutral-500 mt-2">Your honest feedback helps us improve.</p>
        </div>

        <div className="dashboard-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={48}
                    className="transition-colors"
                    fill={(hoverRating || rating) >= star ? "#000000" : "transparent"}
                    color={(hoverRating || rating) >= star ? "#000000" : "#e5e7eb"}
                  />
                </button>
              ))}
            </div>

            {/* Comment Area */}
            <div className="animate-fade-in transition-all">
              <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-2">
                Care to tell us more? (Optional)
              </label>
              <textarea
                id="comment"
                rows={3}
                className="dashboard-input"
                placeholder="What did you love? What could be better?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Opt-in Checkbox */}
            <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              <input
                type="checkbox"
                id="optIn"
                className="w-5 h-5 rounded text-black focus:ring-black border-neutral-300"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
              />
              <label htmlFor="optIn" className="text-sm text-neutral-600">
                Send me future offers and exclusive discounts from this cafe.
              </label>
            </div>

            {error && (
              <div className="text-red-500 flex items-center justify-center text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className={`dashboard-btn-primary py-4 text-lg mt-2 ${
                rating > 0 && !isSubmitting
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
