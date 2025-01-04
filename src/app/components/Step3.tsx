'use client';

import { Bs3Circle } from "react-icons/bs";

const StepThree: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start bg-gray-800 text-white rounded-lg p-6 gap-6">
      {/* Circle with Number */}
      <div className="basis-1/4 flex justify-top gap-4">
        <Bs3Circle className="text-4xl text-gray-400" />
        <p className="text-xl font-bold text-gray-100">Step 3: <br />Run!</p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 flex-grow basis-3/4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepThree;
