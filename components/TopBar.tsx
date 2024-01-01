import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import SvgLogo from "./SvgLogo";

const TopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <SvgLogo />
        <div className="text-light-foreground dark:text-dark-foreground">
          Busy<span className="text-primary font-bold">Researcher</span>
        </div>
      </div>
      {/* Right side menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline">Register</Button>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default TopBar;
