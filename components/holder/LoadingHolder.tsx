import { FC } from "react";
import SvgLoading from "../SvgLoading";
import { Separator } from "../ui/separator";

interface ILoadingHolderProps {
  text: string;
}

const LoadingHolder: FC<ILoadingHolderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-fit m-auto px-6">
      <SvgLoading />
      <Separator className="my-4 bg-foreground/10" />
      <span className="text-center leading-loose line-clamp-3">{text}</span>
    </div>
  );
};

export default LoadingHolder;
