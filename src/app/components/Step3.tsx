'use client';

import { Bs3Circle } from "react-icons/bs";
import { useMeetContext } from "./MeetContext";

const StepThree: React.FC = () => {
  // Use the shared context
  const { submitMeetData, resetForm, isLoading, meetData } = useMeetContext();

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      meetData.meetDate &&
      meetData.meetName &&
      meetData.meetLocation &&
      meetData.resultsFile
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start bg-gray-800 text-white rounded-lg p-6 gap-6">
      {/* Circle with Number */}
      <div className="basis-1/4 flex justify-top gap-4">
        <Bs3Circle className="text-4xl text-gray-400" />
        <p className="text-xl font-bold text-gray-100">Step 3: <br />Run!</p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 flex-grow basis-3/4">
        <div className="flex gap-4">
          <button 
            onClick={submitMeetData}
            disabled={!isFormValid() || isLoading}
            className={`${
              isFormValid() && !isLoading
                ? "bg-blue-500 hover:bg-blue-700" 
                : "bg-gray-500 cursor-not-allowed"
            } text-white font-bold py-2 px-4 rounded-lg flex-1`}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
          
          <button 
            onClick={resetForm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex-1"
          >
            Reset
          </button>
        </div>
        
        {!isFormValid() && (
          <p className="text-yellow-400 text-sm">
            Please complete all required fields (meet date, name, location, and upload a file).
          </p>
        )}
      </div>
    </div>
  );
};

export default StepThree;