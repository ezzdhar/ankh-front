const MessageError = ({ message }: { message: string }) => {
  return <p className="text-red-500 text-xs">{message}</p>;
};

export default MessageError;
