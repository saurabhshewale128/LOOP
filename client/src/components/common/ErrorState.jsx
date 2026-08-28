const ErrorState = ({
    message = "Something went wrong.",
    onRetry,
  }) => {
    return (
      <div className="min-h-[300px] flex items-center justify-center px-4">
  
        <div className="text-center max-w-md">
  
          <div className="text-5xl mb-4">
            ⚠️
          </div>
  
          <h2 className="text-xl font-bold text-slate-800">
            Something went wrong
          </h2>
  
          <p className="text-slate-500 mt-2">
            {message}
          </p>
  
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
            >
              Try Again
            </button>
          )}
  
        </div>
  
      </div>
    );
  };
  
  export default ErrorState;