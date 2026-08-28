const EmptyState = ({
    icon = "📭",
    title = "No Data Found",
    message = "There is no data available yet.",
    actionLabel,
    onAction,
  }) => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center">
  
        <div className="text-5xl mb-4">
          {icon}
        </div>
  
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>
  
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          {message}
        </p>
  
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            {actionLabel}
          </button>
        )}
  
      </div>
    );
  };
  
  export default EmptyState;