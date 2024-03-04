export default function Blur({
  trigger,
  show,
  fullscreen,
  bg,
  showZ,
  hideZ,
  styles,
}) {
  return (
    <div
      onClick={trigger}
      className={` ${styles} ${
        fullscreen ? "absolute w-full h-full" : ""
      } transition-opacity ease-in-out backdrop-blur-md ${
        show ? `${bg} opacity-100` : `opacity-0`
      } z-${show ? showZ : hideZ}`}
    ></div>
  );
}
