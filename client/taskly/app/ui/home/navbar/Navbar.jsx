import Image from "next/image";
import AnchorPoint from "ui/AnchorPoint";
import NavItem from "ui/NavItem";
export default function Navbar({
  image,
  imageAriaLabel,
  imageDimensions,
  imageHREF,
  links,
  connectButons,
  darkMode,
}) {
  if (
    image &&
    (!imageDimensions.width || !imageDimensions.height || !imageAriaLabel)
  ) {
    console.error("Error: provide corrects props for the nav image.");
  }
  return (
    <nav className="flex w-screen">
      <ul className="flex justify-left items-center w-screen">
        {image && (
          <li>
            <AnchorPoint href={imageHREF}>
              <Image
                draggable="false"
                className="m-[1vw] ml-[2vw]"
                src={image}
                aria-label={imageAriaLabel}
                width={imageDimensions.width}
                height={imageDimensions.height}
              />
            </AnchorPoint>
          </li>
        )}
        {links.map((link, index) => (
          <NavItem
            key={index}
            text
            additionalStyles={`transition ease-in-out ${
              darkMode
                ? "text-white hover:text-blue"
                : "text-grey hover:text-black"
            }`}
          >
            <AnchorPoint href={link.href}>{link.title}</AnchorPoint>
          </NavItem>
        ))}
        {connectButons && (
          <>
            <NavItem text additionalStyles="ml-auto text-blue font-light">
              <AnchorPoint href="auth/login">Log in</AnchorPoint>
            </NavItem>
            <AnchorPoint href="auth/signup">
              <NavItem
                text
                additionalStyles={`${
                  darkMode
                    ? "border-gradient-dark-mode-gold-to-black"
                    : "border-1 border-blue rounded-full"
                } p-5 px-10 font-semibold text-blue transition ease-in-out delay-100 hover:scale-105 hover:shadow-2xl shadow-lg`}
              >
                Start
              </NavItem>
            </AnchorPoint>
          </>
        )}
      </ul>
    </nav>
  );
}
