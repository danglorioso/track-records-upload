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
  isDownloading: boolean;         // New state for download status
  downloadSuccess: boolean;       // New state for download success
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
  
  // New state variables for file download
  // const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

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
      const response = await fetch('https://track-api-pbqe.onrender.com', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      // Show success alert
      alert('Meet data successfully submitted and processed!');

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'results.csv';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      } else {
        // Use meet name for the filename if Content-Disposition is not available
        if (meetData.meetName) {
          filename = `${meetData.meetName.replace(/\s+/g, '_')}_results.csv`;
        }
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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
    setDownloadSuccess(false);
  };

  // Value to be provided by the context
  const value: MeetContextType = {
    meetData,
    updateMeetData,
    isLoading,
    apiResponse,
    submitMeetData,
    resetForm,
    isDownloading,
    downloadSuccess,
  };

  return <MeetContext.Provider value={value}>{children}</MeetContext.Provider>;
};