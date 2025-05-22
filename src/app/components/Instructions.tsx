'use client'

import React from 'react';
import Options from './Step1';
import Results from './Step2';
import Submit from './Step3';
import { FaRunning } from "react-icons/fa";
import { MeetProvider } from './MeetContext'

const Instructions = () => {
  return (
    <MeetProvider>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gray-700 text-white p-4 text-center text-xl font-semibold flex items-center justify-center gap-2">
          <FaRunning className="text-2xl" />
          <h1>Track Records Upload</h1>
        </div>

        {/* Step 1 */}
        <Options /> 
        <hr className="border-t border-gray-600 my-2" />

        {/* Step 2 */}
        <Results />
        <hr className="border-t border-gray-600 my-2" />

        {/* Step 3 */}
        <Submit />
      </div>
    </MeetProvider>
  );
};

export default Instructions;