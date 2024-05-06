export default function SlideNav({ children, key }) {
  return (
    <div className="flex justify-between items-center w-full px-[3%] mb-[5%]">
      {children}
    </div>
  );
}
