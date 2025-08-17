export const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-[#fcfbfc]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-gray-600 font-[Poppins]">Loading your data...</p>
    </div>
  </div>
);
