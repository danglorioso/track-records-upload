'use client';

import React from 'react';
import { useMeetContext } from './MeetContext';

const SuccessView: React.FC = () => {
  const { apiResponse, resetForm } = useMeetContext();

  if (!apiResponse) return null;

  return (
    <div className="mt-6 p-4 bg-green-800 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
      <p className="text-green-100 mb-4">
        Meet data was successfully processed and saved.
      </p>
{/*       
      <div className="bg-green-700 p-3 rounded mb-4">
        <h4 className="font-semibold text-white">Meet Details:</h4>
        <ul className="text-green-100 mt-2">
          <li>Meet: {apiResponse.metadata.meetName}</li>
          <li>Date: {apiResponse.metadata.meetDate}</li>
          <li>Location: {apiResponse.metadata.meetLocation}</li>
          <li>Season: {apiResponse.metadata.season}</li>
        </ul>
      </div>
      
      <div className="bg-green-700 p-3 rounded mb-4">
        <h4 className="font-semibold text-white">Results Summary:</h4>
        <p className="text-green-100">
          {apiResponse.results?.eventCount || 0} events and {apiResponse.results?.athleteCount || 0} athletes processed.
        </p>
      </div> */}
      
      <button 
        onClick={resetForm}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Another Meet
      </button>
    </div>
  );
};

export default SuccessView;