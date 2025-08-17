
import React from 'react';

interface IntroductionProps {
  onStart: () => void;
}

const InstructionStep: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-darkgray">{title}</h3>
      <p className="text-gray-600 mt-1">{children}</p>
    </div>
  </div>
);

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-4xl mx-auto text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-darkgray tracking-tight">
        Welcome to the Dominant Color Survey
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        Your unique perception of color is crucial for our research. By participating in this engaging survey, you'll help us build better tools for artists, designers, and scientists. Your contribution directly impacts our understanding of visual aesthetics.
      </p>

      <div className="mt-10 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
        <InstructionStep 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2.5 2.5M10 10l2.5 2.5" /></svg>}
          title="Use the Magnifier"
        >
          Click and hold the left mouse button on an image to activate a magnifier. This lets you inspect colors up close.
        </InstructionStep>
        <InstructionStep 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          title="Pick a Color"
        >
          A red 'X' in the magnifier shows the exact pixel. Release the mouse button to select the color at that point.
        </InstructionStep>
        <InstructionStep 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
          title="Select Exactly 5 Colors"
        >
          For each image, you must choose exactly 5 colors that you feel are the most dominant or interesting.
        </InstructionStep>
        <InstructionStep 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>}
          title="Edit or Delete"
        >
          Made a mistake? No problem. You can easily edit the precise shade of a picked color or delete it entirely.
        </InstructionStep>
      </div>

      <div className="mt-10">
        <button
          onClick={onStart}
          className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          Let's Begin!
        </button>
      </div>
    </div>
  );
};

export default Introduction;