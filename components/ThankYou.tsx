
import React from 'react';

const ThankYou: React.FC = () => {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-2xl mx-auto text-center animate-fade-in">
      <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-darkgray tracking-tight">
        Thank You!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Your survey has been submitted successfully. We appreciate you taking the time to share your perspective on color. Your contribution is incredibly valuable to our research.
      </p>
      <div className="mt-8">
        <p className="text-gray-500">You can now safely close this window.</p>
      </div>
    </div>
  );
};

export default ThankYou;
