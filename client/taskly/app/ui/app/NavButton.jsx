export default function NavButton({
  children,
  additionalStyles,
  flex,
  flexShrinkGrow,
}) {
  return (
    <button
      className={`${additionalStyles} ${
        flexShrinkGrow && "grow-0 shrink-0"
      } transition ease-in hover:scale-110 ${
        flex && "flex items-center justify-center"
      }`}
    >
      {children}
    </button>
  );
}
