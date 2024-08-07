export default function NavButton({
  children,
  styles,
  flex,
  flexShrinkGrow,
  onClick,
  notHover,
  disabled = false,
}) {
  return (
    <button
      className={`${styles} ${
        flexShrinkGrow && "grow-0 shrink-0"
      } transition ease-in ${notHover ? "" : "hover:scale-110"} ${
        flex && "flex items-center justify-center"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
