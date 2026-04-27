import React from 'react';

export default function MythUI({ result, onCheck }) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl p-6 mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <div className="w-full mb-6 text-center">
        {result ? (
          <div className="p-4 bg-gray-50 rounded-lg text-gray-800 text-lg font-medium">
            {result}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-gray-400 text-sm">
            No result available
          </div>
        )}
      </div>
      
      <button 
        onClick={onCheck}
        className="px-8 py-3 text-sm font-semibold text-white transition-all bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Check
      </button>
    </div>
  );
}
