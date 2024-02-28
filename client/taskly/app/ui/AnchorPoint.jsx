export default function AnchorPoint({ href, children, additionalStyles }) {
  return (
    <a draggable="false" className={additionalStyles} href={href}>
      {children}
    </a>
  );
}
