'use client'

import React from 'react'
import Options from './Options'

const Instructions = () => {
  return (

    <div className="justify-center h-full w-11/12 max-w-4xl">
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gray-700 text-white p-6 text-center text-xl font-semibold">
          <h1>Track Records Upload</h1>
        </div>
        {/* Step 1 */}
        <Options></Options>

        {/* Step 2 */}

        {/* Step 3 */}
      </div>
    </div>
  );
};

export default Instructions