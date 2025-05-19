'use client';

import React from "react";
import { Bs1Circle } from "react-icons/bs";
import { useMeetContext } from "./MeetContext";

const StepOne: React.FC = () => {
  // Use the shared context
  const { meetData, updateMeetData } = useMeetContext();

  return (
    <div className="flex flex-col md:flex-row items-start bg-gray-800 text-white rounded-lg p-6 gap-6">
      {/* Circle with Number */}
      <div className="basis-1/4 flex justify-top gap-4">
        <Bs1Circle className="text-4xl text-gray-400" />
        <p className="text-xl font-bold text-gray-100">Step 1: <br />Meet Details</p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 flex-grow basis-3/4">
        {/* Meet Date */}
        <div>
          <label htmlFor="meetDate" className="block text-md font-medium text-gray-400">
            Meet Date
          </label>
          <input
            type="date"
            id="meetDate"
            value={meetData.meetDate}
            onChange={(e) => updateMeetData('meetDate', e.target.value)}
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Edition + Season */}
        <div className="flex gap-4">
          {/* Season */}
          <div className="flex-1">
            <label htmlFor="season" className="block text-md font-medium text-gray-400">
              Season
            </label>
            <select
              id="season"
              value={meetData.season}
              onChange={(e) => updateMeetData('season', e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>
          
          {/* Edition */}
          <div className="flex-1">
            <label htmlFor="edition" className="block text-md font-medium text-gray-400">
              Edition
            </label>
            <input
              type="text"
              id="edition"
              value={meetData.edition}
              onChange={(e) => updateMeetData('edition', e.target.value)}
              placeholder="Enter edition"
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Meet Name */}
        <div>
          <label htmlFor="meetName" className="block text-md font-medium text-gray-400">
            Meet Name
          </label>
          <input
            type="text"
            id="meetName"
            value={meetData.meetName}
            onChange={(e) => updateMeetData('meetName', e.target.value)}
            placeholder="Enter meet name"
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Meet Location */}
        <div>
          <label htmlFor="meetLocation" className="block text-md font-medium text-gray-400">
            Meet Location
          </label>
          <input
            type="text"
            id="meetLocation"
            value={meetData.meetLocation}
            onChange={(e) => updateMeetData('meetLocation', e.target.value)}
            placeholder="Enter meet location"
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Timing & URL */}
        <div className="flex gap-4">
          {/* Timing */}
          <div className="flex-1">
            <label htmlFor="timing" className="block text-md font-medium text-gray-400">
              Timing
            </label>
            <select
              id="timing"
              value={meetData.timing}
              onChange={(e) => updateMeetData('timing', e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Hand-timed">Hand-timed</option>
              <option value="FAT-timed">FAT</option>
            </select>
          </div>
          
          {/* URL */}
          <div className="flex-1">
            <label htmlFor="url" className="block text-md font-medium text-gray-400">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={meetData.url}
              onChange={(e) => updateMeetData('url', e.target.value)}
              placeholder="Enter URL"
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;