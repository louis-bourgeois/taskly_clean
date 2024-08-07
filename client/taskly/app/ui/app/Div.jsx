import { forwardRef } from "react";

const Div = forwardRef(
  ({ children, styles, absolute, notBorder, _id = "", ...props }, ref) => {
    return (
      <div
        id={_id}
        ref={ref}
        className={`${styles} ${absolute ? "absolute" : ""} shadow-xl ${
          notBorder ? "" : "border border-dominant"
        }`}
        {...props} // Passer les attributs supplémentaires au div
      >
        {children}
      </div>
    );
  }
);

Div.displayName = "Div";

export default Div;
