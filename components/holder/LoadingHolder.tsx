import { FC } from "react";
import SvgLoading from "../SvgLoading";
import { Separator } from "../ui/separator";

interface ILoadingHolderProps {
  text: string;
}

const LoadingHolder: FC<ILoadingHolderProps> = ({ text }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-fit m-auto px-6">
      <SvgLoading />
      <Separator className="md:hidden my-4 bg-foreground/10" />
      <span className="text-center leading-relaxed">{text}</span>
    </div>
  );
};

export default LoadingHolder;
