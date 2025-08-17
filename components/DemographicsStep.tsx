
import React, { useState } from 'react';
import { Demographics } from '../types';

interface DemographicsProps {
  onSubmit: (data: Demographics) => void;
}

const DemographicsStep: React.FC<DemographicsProps> = ({ onSubmit }) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !age) {
      setError('Please fill out both fields.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
        setError('Please enter a valid age between 10 and 120.');
        return;
    }
    setError('');
    onSubmit({ gender, age });
  };

  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-md mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-darkgray">Tell Us About Yourself</h2>
      <p className="mt-2 text-center text-gray-600">This anonymous data provides valuable context for our research, helping us understand how color perception might vary across different groups.</p>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${!gender ? 'text-gray-400' : 'text-gray-900'}`}
          >
            <option value="" disabled>Select your gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="10"
            max="120"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
            placeholder="e.g., 25"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            Continue to Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemographicsStep;