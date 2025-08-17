
import React, { useState, useCallback } from 'react';
import { AppStep, Demographics, SurveyImage } from './types';
import { IMAGE_URLS } from './constants';
import Introduction from './components/Introduction';
import DemographicsStep from './components/DemographicsStep';
import Survey from './components/Survey';
import ThankYou from './components/ThankYou';
import { submitToGoogleSheet } from './services/googleSheetsService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Introduction);
  const [demographics, setDemographics] = useState<Demographics>({ gender: '', age: '' });
  const [surveyData, setSurveyData] = useState<SurveyImage[]>(() => 
    IMAGE_URLS.map(url => ({ image: url, selections: [] }))
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setStep(AppStep.Demographics);
  }, []);

  const handleDemographicsSubmit = useCallback((data: Demographics) => {
    setDemographics(data);
    setStep(AppStep.Survey);
  }, []);

  const handleSurveySubmit = useCallback(async (finalSurveyData: SurveyImage[]) => {
    setSurveyData(finalSurveyData);
    setIsSubmitting(true);
    setSubmissionError(null);
    console.log("Final Survey Data:", { demographics, survey: finalSurveyData });

    try {
      await submitToGoogleSheet({ demographics, survey: finalSurveyData });
      setStep(AppStep.ThankYou);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionError("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [demographics]);

  const renderStep = () => {
    switch (step) {
      case AppStep.Introduction:
        return <Introduction onStart={handleStart} />;
      case AppStep.Demographics:
        return <DemographicsStep onSubmit={handleDemographicsSubmit} />;
      case AppStep.Survey:
        return <Survey surveyData={surveyData} setSurveyData={setSurveyData} onSubmit={handleSurveySubmit} isSubmitting={isSubmitting} submissionError={submissionError} />;
      case AppStep.ThankYou:
        return <ThankYou />;
      default:
        return <Introduction onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default App;
