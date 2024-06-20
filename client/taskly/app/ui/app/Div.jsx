export default function Div({
  children,
  styles,
  absolute,
  notBorder,
  ref,
  ...props
}) {
  return (
    <div
      ref={ref}
      className={`${styles} ${absolute ? "absolute" : ""} shadow-xl ${
        notBorder ? "" : "border border-blue"
      }`}
      {...props} // Passer les attributs supplémentaires au div
    >
      {children}
    </div>
  );
}
