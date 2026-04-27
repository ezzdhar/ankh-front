export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#FFF8EF]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#3A0F0E] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
