export default function Div({ children, styles, absolute, notBorder }) {
  return (
    <div
      className={`${styles} ${absolute ? "absolute" : " "} shadow-xl ${
        notBorder ? "" : "border border-blue"
      } `}
    >
      {children}
    </div>
  );
}
