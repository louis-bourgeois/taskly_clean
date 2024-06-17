import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function SlickCarousel({ children, settings }) {
  console.log("slick carousel rendered");
  return (
    <div className="overflow-hidden mt-[2.5vh]">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}
