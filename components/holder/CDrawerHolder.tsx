"use client";

import { FC } from "react";
import { Drawer } from "vaul";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import Latex from "react-latex-next";

interface ICDrawerHolderProps {
  drawerTrigger: React.ReactNode;
  id: string;
  title: string;
  children: React.ReactNode;
}

const CDrawerHolder: FC<ICDrawerHolderProps> = ({
  drawerTrigger,
  id,
  title,
  children,
}) => {
  return (
    <Drawer.Root dismissible={false}>
      <Drawer.Trigger asChild>{drawerTrigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />
        <Drawer.Content className="h-[85%] fixed bottom-0 left-0 right-0">
          <div className="py-8 px-4 bg-background overflow-auto h-full rounded-t-md border-t border-x border-secondary flex-1">
            <div className="sm:max-w-[90%] md:max-w-[80%] mx-auto flex flex-col gap-4">
              <Drawer.Title className="flex items-start justify-between gap-4 font-bold text-lg/relaxed md:text-2xl/relaxed text-primary">
                <a
                  href={`${process.env.NEXT_PUBLIC_ARXIV_BASE_URL}/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-6 md:line-clamp-3 hover:underline w-fit"
                >
                  <Latex>{title}</Latex>
                </a>
                <Drawer.Close tabIndex={-1}>
                  <Button variant="destructive" size="icon" className="h-8 w-8">
                    <X height={18} width={18} />
                  </Button>
                </Drawer.Close>
              </Drawer.Title>
              <Separator className="bg-foreground/10" />
              <div className="text-justify leading-loose select-text">
                {children}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CDrawerHolder;
