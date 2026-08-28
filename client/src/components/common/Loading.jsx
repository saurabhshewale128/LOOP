const Loading = ({
    message = "Loading...",
  }) => {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
  
        <div className="flex flex-col items-center justify-center text-center">
  
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
  
          {/* Message */}
          <p className="mt-4 text-slate-600 font-medium">
            {message}
          </p>
  
        </div>
  
      </div>
    );
  };
  
  export default Loading;