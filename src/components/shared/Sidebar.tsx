export default function Sidebar() {
  return (
    <div className="w-full max-w-[400px] flex-1 p-4 flex flex-col gap-2">
      <h1>Chat dApp</h1>
      <div className="flex flex-col gap-1 overflow-y-auto">
        {Array.from({ length: 20 }).map((_, _key) => (
          <div
            key={_key}
            className="flex cursor-pointer p-3 items-center gap-4 bg-secondary/20 hover:bg-secondary/50 rounded-lg">
            <div className="rounded-full w-10 h-10 bg-secondary"></div>
            <h1>@john_doe</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
