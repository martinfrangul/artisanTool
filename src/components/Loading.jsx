const Loading = ({ isLoading }) => {
    if (!isLoading) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl z-50">
        Loading...
      </div>
    );
  };
  
  export default Loading;
  