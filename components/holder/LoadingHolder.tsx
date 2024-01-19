import { FC } from "react";
import SvgLoading from "../SvgLoading";

interface ILoadingHolderProps {
  text: string;
}

const LoadingHolder: FC<ILoadingHolderProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-2 w-fit m-auto px-6">
      <SvgLoading />
      <span className="hidden sm:block">{text}</span>
    </div>
  );
};

export default LoadingHolder;
