import Link from "next/link";
import CTA from "./CTA";

const Navbar = ({ logo: Logo }) => {
  return (
    <nav className="flex flex-col sm:flex-row justify-between py-4 w-full px-4">
      <div className="flex items-center gap-3 justify-center mb-4 sm:mb-0">
        <div className="w-10 h-10 flex items-center justify-center">
          <Logo className="w-full h-full" />
        </div>
        <span className="font-bold font-smooth antialiased text-xl">
          Todo<span className="text-dominant">ly</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <Link href="/features" className="w-full sm:w-auto">
          <CTA
            title="Features"
            type="ghost"
            className="w-full py-3 px-6 text-lg"
          />
        </Link>
        <Link href="/pricing" className="w-full sm:w-auto">
          <CTA
            title="Pricing"
            type="ghost"
            className="w-full py-3 px-6 text-lg"
          />
        </Link>
        <Link href="/auth/login" className="w-full sm:w-auto">
          <CTA
            title="Login"
            type="secondary"
            className="w-full py-3 px-6 text-lg"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
