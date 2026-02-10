const EmptyState = ({ message }) => {
  return (
    <div className="bg-gray-100 rounded-xl py-10 px-5 flex items-center justify-center">
      <p className="text-gray-500 text-sm m-0">{message}</p>
    </div>
  );
};

export default EmptyState;
