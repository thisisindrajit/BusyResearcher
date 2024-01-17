import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import SvgLogo from "./SvgLogo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

const TopBar: React.FC = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-4">
          <SvgLogo />
          <div className="hidden md:block text-foreground">
            Busy<span className="text-primary font-bold">Researcher</span>
          </div>
        </div>
      </Link>
      {/* Right side menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <RegisterLink postLoginRedirectURL="/user/welcome">
          <Button variant="outline">Register</Button>
        </RegisterLink>
        <LoginLink postLoginRedirectURL="/user">
          <Button>Login</Button>
        </LoginLink>
      </div>
    </div>
  );
};

export default TopBar;
