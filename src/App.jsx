import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          +
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          MediCare Hub
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          პროექტის ბაზისი და გლობალური სტილები წარმატებით გამართულია.
        </p>
        <div className="flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            ✓ Tailwind CSS Ready
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;