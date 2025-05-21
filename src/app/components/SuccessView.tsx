'use client'

import React, { useState } from 'react';
import { useMeetContext } from './MeetContext';

// Note: This assumes your current SuccessView component has a similar structure
// Just adding download functionality without changing the existing styling

const SuccessView: React.FC = () => {
  const { meetData, isDownloading, downloadSuccess } = useMeetContext();
  const [downloadAttempted, setDownloadAttempted] = useState(false);

  // Function to trigger file download from the API
  const handleDownloadResults = async () => {
    setDownloadAttempted(true);
    
    try {
      // Create FormData for file upload (reusing the same data from the form submission)
      const formData = new FormData();
      
      // Add all fields to the form data
      Object.entries(meetData).forEach(([key, value]) => {
        if (key === 'resultsFile' && value instanceof File) {
          formData.append('file', value);
        } else if (value !== null) {
          formData.append(key, String(value));
        }
      });

      // Make the API call to get the CSV file
      const response = await fetch('https://track-api-pbqe.onrender.com', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

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
      console.error('Error downloading results file:', error);
      alert('Failed to download results. Please try again.');
    }
  };

  // Your existing SuccessView jsx remains unchanged
  // Just adding a download button

  return (
    <div className="success-view">
      {/* Keep your existing success message UI */}
      <div className="success-message">
        <h2>Processing Complete!</h2>
        <p>Your track meet results have been processed successfully.</p>
        
        {/* Add download button */}
        <button 
          onClick={handleDownloadResults}
          disabled={isDownloading || downloadAttempted && downloadSuccess}
          className="download-button"
        >
          {isDownloading ? 'Downloading...' : downloadAttempted && downloadSuccess ? 'Downloaded' : 'Download Results CSV'}
        </button>
        
        {downloadSuccess && (
          <p className="text-green-600">Your file has been downloaded successfully!</p>
        )}
      </div>
      
      {/* Keep any other existing content */}
    </div>
  );
};

export default SuccessView;