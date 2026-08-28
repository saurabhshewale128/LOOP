const Loading = ({
    message = "Loading..."
  }) => {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-6">
  
        <div className="text-center">
  
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
  
          <p className="mt-4 text-slate-600 font-medium">
            {message}
          </p>
  
        </div>
  
      </div>
    );
  };
  
  export default Loading;