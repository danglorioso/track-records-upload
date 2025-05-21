'use client';

import { Bs2Circle } from "react-icons/bs";
import { useMeetContext } from "./MeetContext";

const StepTwo: React.FC = () => {
  // Use the shared context
  const { meetData, updateMeetData } = useMeetContext();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    updateMeetData('resultsFile', selectedFile);
  };

  return (
    <div className="flex flex-col md:flex-row items-start bg-gray-800 text-white rounded-lg p-6 gap-6">
      {/* Circle with Number */}
      <div className="basis-1/4 flex justify-top gap-4">
        <Bs2Circle className="text-4xl text-gray-400" />
        <p className="text-xl font-bold text-gray-100">Step 2: <br />Results upload</p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 flex-grow basis-3/4">
        {/* File Upload */}
        <div>
          <label htmlFor="file-upload" className="block text-md font-medium text-gray-400">
            Upload Results*
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {meetData.resultsFile && (
            <p className="text-sm text-gray-300 mt-2">
              {meetData.resultsFile.name} selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;