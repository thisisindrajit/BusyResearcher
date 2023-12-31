import Image from "next/image";
import { Button } from "./ui/button";

const TopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image
          src="/images/logo.svg"
          alt="BusyResearcher"
          width={25}
          height={25}
        />
        <div className="text-primary-foreground">
          Busy<span className="text-primary font-bold">Researcher</span>
        </div>
      </div>
      {/* Login */}
      <Button variant="darkSecondary">Login</Button>
    </div>
  );
};

export default TopBar;
