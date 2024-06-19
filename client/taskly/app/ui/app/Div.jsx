export default function Div({
  children,
  styles,
  absolute,
  notBorder,
  ...props // Capturer les attributs supplémentaires
}) {
  return (
    <div
      className={`${styles} ${absolute ? "absolute" : ""} shadow-xl ${
        notBorder ? "" : "border border-blue"
      }`}
      {...props} // Passer les attributs supplémentaires au div
    >
      {children}
    </div>
  );
}
