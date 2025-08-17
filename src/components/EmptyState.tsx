import { BarChart3, RefreshCw } from "lucide-react";

export const EmptyState = () => (
  <div className="w-full h-full  rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8">
    <div className="bg-blue-100 p-4 rounded-full mb-4">
      <BarChart3 className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No data to display
    </h3>
    <p className="text-gray-600 text-center mb-4 max-w-sm">
      There's no data available.
    </p>
    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
      <RefreshCw className="w-4 h-4" />
      Refresh Data
    </button> */}
  </div>
);
