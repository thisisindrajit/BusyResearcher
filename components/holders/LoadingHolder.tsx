import { FC, ReactNode } from "react";
import SvgLoading from "../svg/SvgLoading";
import { Separator } from "../ui/separator";

interface ILoadingHolderProps {
  children: ReactNode;
}

const LoadingHolder: FC<ILoadingHolderProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-fit m-auto px-6">
      <SvgLoading />
      <Separator className="my-4 bg-gradient-to-r from-background via-primary to-background" />
      <div className="text-center leading-relaxed">{children}</div>
    </div>
  );
};

export default LoadingHolder;
