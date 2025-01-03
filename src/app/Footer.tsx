'use client'

import React from 'react'

const Footer = () => {
  return (
    <footer className="text-gray-400 text-center p-4 w-full">
      <p>
        Developed by{" "}
        <a
          href="https://danglorioso.com" // Replace with your actual website URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          Dan Glorioso
        </a>
        . Inspired by Jonathan McGurrin.
      </p>
    </footer>
  );
};

export default Footer
