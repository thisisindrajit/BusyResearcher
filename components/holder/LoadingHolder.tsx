import { FC } from "react";
import SvgLoading from "../SvgLoading";

interface ILoadingHolderProps {
  text: string;
}

const LoadingHolder: FC<ILoadingHolderProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-2 w-fit m-auto px-6">
      <SvgLoading />
      {text}
    </div>
  );
};

export default LoadingHolder;
