'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the meet data
interface MeetData {
  meetDate: string;
  edition: string;
  meetName: string;
  meetLocation: string;
  season: string;
  url: string;
  timing: string;
  resultsFile: File | null;
}

// Define the context type
interface MeetContextType {
  meetData: MeetData;
  updateMeetData: (field: keyof MeetData, value: MeetData[keyof MeetData]) => void;
  isLoading: boolean;
  apiResponse: unknown | null;
  submitMeetData: () => Promise<void>;
  resetForm: () => void;
}

// Create the context with default values
const MeetContext = createContext<MeetContextType | undefined>(undefined);

// Custom hook to use the context
export const useMeetContext = () => {
  const context = useContext(MeetContext);
  if (context === undefined) {
    throw new Error('useMeetContext must be used within a MeetProvider');
  }
  return context;
};

// Context provider component
export const MeetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for meet data
  const [meetData, setMeetData] = useState<MeetData>({
    meetDate: '',
    edition: '',
    meetName: '',
    meetLocation: '',
    season: 'Indoor',
    url: '',
    timing: 'Hand-timed',
    resultsFile: null,
  });

  // State for API call
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<unknown | null>(null);

  // Update a specific field in the meet data
  const updateMeetData = (field: keyof MeetData, value: MeetData[keyof MeetData]) => {
    setMeetData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Submit the meet data to the API
  const submitMeetData = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      // Add all fields to the form data
      Object.entries(meetData).forEach(([key, value]) => {
        if (key === 'resultsFile' && value instanceof File) {
          formData.append('file', value);
        } else if (value !== null) {
          formData.append(key, String(value));
        }
      });

      // Make the API call to your Python parser
      // const response = await fetch('/api/parse-results', {
      const response = await fetch('http://localhost:8000/parse-results', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header when using FormData, 
        // the browser will set it automatically with the boundary
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      
      // Show success alert
      alert('Meet data successfully submitted and processed!');
      
    } catch (error) {
      console.error('Error submitting meet data:', error);
      alert('Error submitting meet data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setMeetData({
      meetDate: '',
      edition: '',
      meetName: '',
      meetLocation: '',
      season: 'Indoor',
      url: '',
      timing: 'Hand-timed',
      resultsFile: null,
    });
    setApiResponse(null);
  };

  // Value to be provided by the context
  const value: MeetContextType = {
    meetData,
    updateMeetData,
    isLoading,
    apiResponse,
    submitMeetData,
    resetForm,
  };

  return <MeetContext.Provider value={value}>{children}</MeetContext.Provider>;
};

// 'use client'

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define the shape of the meet data
// interface MeetData {
//   meetDate: string;
//   edition: string;
//   meetName: string;
//   meetLocation: string;
//   season: string;
//   url: string;
//   timing: string;
//   resultsFile: File | null;
// }

// // Define the context type
// interface MeetContextType {
//   meetData: MeetData;
//   updateMeetData: (field: keyof MeetData, value: MeetData[keyof MeetData]) => void;
//   isLoading: boolean;
//   apiResponse: unknown | null;
//   submitMeetData: () => Promise<void>;
//   resetForm: () => void;
// }

// // Create the context with default values
// const MeetContext = createContext<MeetContextType | undefined>(undefined);

// // Custom hook to use the context
// export const useMeetContext = () => {
//   const context = useContext(MeetContext);
//   if (context === undefined) {
//     throw new Error('useMeetContext must be used within a MeetProvider');
//   }
//   return context;
// };

// // Context provider component
// export const MeetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   // State for meet data
//   const [meetData, setMeetData] = useState<MeetData>({
//     meetDate: '',
//     edition: '',
//     meetName: '',
//     meetLocation: '',
//     season: 'Indoor',
//     url: '',
//     timing: 'Hand-timed',
//     resultsFile: null,
//   });

//   // State for API call
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [apiResponse, setApiResponse] = useState<unknown | null>(null);

//   // Update a specific field in the meet data
//   const updateMeetData = (field: keyof MeetData, value: MeetData[keyof MeetData]) => {
//     setMeetData(prevState => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   // Submit the meet data to the API
//   const submitMeetData = async () => {
//     try {
//       setIsLoading(true);
      
//       // Create FormData for file upload
//       const formData = new FormData();
//       // Add all fields to the form data
//       Object.entries(meetData).forEach(([key, value]) => {
//         if (key === 'resultsFile' && value instanceof File) {
//           formData.append('file', value);
//         } else if (value !== null) {
//           formData.append(key, String(value));
//         }
//       });

//       // Configure the API URL based on environment
//       // In development, we'll use the FastAPI backend directly
//       // In production, we might proxy through Next.js
//       const apiUrl = process.env.NODE_ENV === 'development' 
//         ? 'http://localhost:8000/api/parse-results' 
//         : '/api/parse-results';
      
//       console.log('Calling API at:', apiUrl);

//       // Make the API call to your FastAPI backend
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: formData,
//         // Don't set Content-Type header when using FormData, 
//         // the browser will set it automatically with the boundary
//       });

//       if (!response.ok) {
//         throw new Error(`API call failed with status: ${response.status}`);
//       }

//       const data = await response.json();
//       setApiResponse(data);
      
//       // Show success alert
//       alert('Meet data successfully submitted and processed!');
      
//     } catch (error) {
//       console.error('Error submitting meet data:', error);
//       alert('Error submitting meet data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Reset the form
//   const resetForm = () => {
//     setMeetData({
//       meetDate: '',
//       edition: '',
//       meetName: '',
//       meetLocation: '',
//       season: 'Indoor',
//       url: '',
//       timing: 'Hand-timed',
//       resultsFile: null,
//     });
//     setApiResponse(null);
//   };

//   // Value to be provided by the context
//   const value: MeetContextType = {
//     meetData,
//     updateMeetData,
//     isLoading,
//     apiResponse,
//     submitMeetData,
//     resetForm,
//   };

//   return <MeetContext.Provider value={value}>{children}</MeetContext.Provider>;
// };