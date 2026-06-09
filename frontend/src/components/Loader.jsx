import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loader = ({ title = "Loading", message = "Please wait..." }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-center px-4">
      <FiLoader className="h-12 w-12 animate-spin text-black" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-base text-gray-600">{message}</p>
    </div>
  );
};

export default Loader;
