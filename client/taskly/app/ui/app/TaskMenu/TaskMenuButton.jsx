export default function TaskMenuButton({
  flex = true,
  children,
  width,
  height,
  moreRoundedCorners,
  flexCol = false,
  othersStyles = "",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`transition transition-scale active:scale-95 addMenuElement ${
        flex && "flex"
      } ${flexCol ? "flex-col" : ""} ${width ? `w-[${width}]` : ""} ${
        height ? `h-[${height}]` : ""
      } rounded-[20px] ${
        moreRoundedCorners ? `rounded-${moreRoundedCorners}-[3.125vw]` : ""
      } ${othersStyles}`}
    >
      {children}
    </button>
  );
}
