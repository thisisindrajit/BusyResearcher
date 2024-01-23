import TopBar from "@/components/common/TopBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FC } from "react";

interface IErrorHolderProps {
  error?: string;
}
const ErrorHolder: FC<IErrorHolderProps> = ({ error }) => {
  return (
    <>
      <TopBar />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-3xl/snug lg:text-4xl/snug xl:text-5xl/snug text-destructive">
          {`Oops! :(`}
        </div>
        <div className="leading-relaxed text-center">
          {error ||
            `Some error occurred! We are sorry for the inconvenience caused ☹️`}
        </div>
        <Separator className="bg-gradient-to-r from-background via-destructive to-background my-4" />
        <Link href="/" tabIndex={-1}>
          <Button>Go back home</Button>
        </Link>
      </div>
    </>
  );
};

export default ErrorHolder;
