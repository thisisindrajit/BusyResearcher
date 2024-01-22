import { IScholarlyArticle } from "@/app/api/search/route";
import { convertToPrettyDateFormat } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { FC } from "react";
import Latex from "react-latex-next";
import DrawerHolder from "./AbstractDrawer";
import { Button } from "../ui/button";
import Authors from "./Authors";
import Categories from "./Categories";

const ScholarlyArticleCard: FC<{ data: IScholarlyArticle }> = ({ data }) => {
  // Function to render the abstract
  const renderAbstract = () => {
    const fullAbstract = data.abstract;

    if (!fullAbstract) return "No abstract available.";

    const splittedAbstract = fullAbstract.split(" ").slice(0, 50).join(" ");

    if (splittedAbstract.length < fullAbstract.length) {
      return (
        <div>
          <Latex>{`${splittedAbstract}... `}</Latex>
          <DrawerHolder
            drawerTrigger={
              <Button
                variant="ghost"
                className="p-0 bg-transparent inline font-bold text-base text-secondary underline cursor-pointer h-fit w-fit"
              >
                Show more
              </Button>
            }
            id={data.id}
            title={data.title}
            authors={data.authors}
            abstract={fullAbstract}
            categories={data.categories}
            category_ids={data.category_ids}
          />
        </div>
      );
    } else {
      return <Latex>{fullAbstract}</Latex>;
    }
  };
  return (
    <div
      className="flex flex-col gap-4 border border-foreground/30 dark:border-foreground/25 rounded-md p-4 md:p-6 backdrop-blur-md bg-light-foreground/5"
      key={data.id}
    >
      {/* Title, authors and published */}
      <div className="flex flex-col gap-2">
        <a
          href={`${process.env.NEXT_PUBLIC_ARXIV_BASE_URL}/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl/relaxed text-primary font-bold underline w-fit"
        >
          <Latex>{data.title}</Latex>
        </a>
        <Authors authors={data.authors} />
        {data.published && (
          <div className="text-xs flex gap-2 items-center w-fit font-bold text-secondary">
            <CalendarDays
              height={14}
              width={14}
              className="min-w-fit mb-[3.5px]"
            />
            <span>{convertToPrettyDateFormat(data.published)}</span>
          </div>
        )}
      </div>
      {/* Abstract */}
      <div className="text-justify leading-loose text-foreground/80 dark:text-foreground/70">
        {renderAbstract()}
      </div>
      {/* Categories */}
      <Categories
        categories={data.categories}
        category_ids={data.category_ids}
      />
    </div>
  );
};

export default ScholarlyArticleCard;
