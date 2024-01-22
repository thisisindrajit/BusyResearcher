import { FC } from "react";
import { Drawer } from "vaul";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import Latex from "react-latex-next";
import Authors from "./Authors";
import Categories from "./Categories";

interface IAbstractDrawerProps {
  drawerTrigger: React.ReactNode;
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  category_ids: string[];
}

const AbstractDrawer: FC<IAbstractDrawerProps> = ({
  drawerTrigger,
  id,
  title,
  authors,
  abstract,
  categories,
  category_ids
}) => {
  return (
    <Drawer.Root dismissible={false}>
      <Drawer.Trigger asChild>{drawerTrigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/75" />
        <Drawer.Content className="h-[85%] fixed bottom-0 left-0 right-0">
          <div className="bg-background overflow-auto h-full rounded-t-md border-t border-x border-primary flex-1">
            {/* Main container */}
            <div className="px-6 pt-6 sm:py-8 sm:px-4 sm:max-w-[90%] md:max-w-[80%] mx-auto flex flex-col min-h-full gap-4">
              {/* Title, close button (for large screens and authors) */}
              <Drawer.Title className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_ARXIV_BASE_URL}/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline w-fit font-bold text-xl/relaxed text-primary"
                  >
                    <Latex>{title}</Latex>
                  </a>
                  <Authors authors={authors} />
                </div>
                <Drawer.Close tabIndex={-1} className="hidden sm:block">
                  <Button variant="destructive" size="icon" className="h-8 w-8">
                    <X height={18} width={18} />
                  </Button>
                </Drawer.Close>
              </Drawer.Title>
              <Separator className="bg-foreground/10" />
              {/* Abstract */}
              <div className="text-justify leading-loose select-text">
                <Latex>{abstract}</Latex>
              </div>
              {/* Categories */}
              <Categories categories={categories} category_ids={category_ids} />
              {/* Bottom close button holder (for small screens) */}
              <div className="m-auto mb-0 block sm:hidden sticky bottom-0 w-full bg-background py-6">
                <Drawer.Close tabIndex={-1} className="w-full">
                  <Button variant="destructive" className="w-full">
                    Close
                  </Button>
                </Drawer.Close>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AbstractDrawer;
