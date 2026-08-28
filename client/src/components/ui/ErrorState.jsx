const ErrorState = ({
    message = "Something went wrong.",
    onRetry,
  }) => {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-6">
  
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center max-w-md w-full">
  
          <div className="text-5xl mb-4">
            ⚠️
          </div>
  
          <h2 className="text-xl font-bold text-slate-900">
            Unable to Load
          </h2>
  
          <p className="text-slate-500 mt-2 leading-relaxed">
            {message}
          </p>
  
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              🔄 Try Again
            </button>
          )}
  
        </div>
  
      </div>
    );
  };
  
  export default ErrorState;