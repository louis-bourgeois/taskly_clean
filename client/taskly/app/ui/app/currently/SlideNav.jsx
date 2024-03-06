export default function SlideNav({ children, key }) {
  return (
    <div className="flex justify-between w-full px-[3%]">
      {children}
    </div>
  );
}
