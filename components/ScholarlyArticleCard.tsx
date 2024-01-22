import { IScholarlyArticle } from "@/app/api/search/route";
import { convertToPrettyDateFormat } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import Latex from "react-latex-next";
import DrawerHolder from "./holder/DrawerHolder";
import { Button } from "./ui/button";

const ScholarlyArticleCard: FC<{ data: IScholarlyArticle }> = ({ data }) => {
  const maxNoOfAuthorsThatCanBeShown = 20;

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
          >
            <Latex>{fullAbstract}</Latex>
          </DrawerHolder>
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
        {data.authors.length > 0 && (
          <div className="leading-loose">
            {data.authors
              .slice(0, maxNoOfAuthorsThatCanBeShown)
              .map((a, index) => {
                return (
                  <span key={index} className="font-bold">
                    {a}
                    {index !==
                      data.authors.slice(0, maxNoOfAuthorsThatCanBeShown)
                        .length -
                        1 && ", "}
                  </span>
                );
              })}
            {data.authors.length > maxNoOfAuthorsThatCanBeShown && (
              <span className="font-bold">
                {` and ${data.authors.length - maxNoOfAuthorsThatCanBeShown} ${
                  data.authors.length - maxNoOfAuthorsThatCanBeShown > 1
                    ? "authors"
                    : "author"
                } `}
              </span>
            )}
          </div>
        )}
        {data.published && (
          <div className="text-xs flex gap-2 items-center w-fit font-bold text-secondary">
            <CalendarDays
              height={14}
              width={14}
              className="min-w-fit mb-[3.5px]"
            />
            {convertToPrettyDateFormat(data.published)}
          </div>
        )}
      </div>
      <div className="text-justify leading-loose text-foreground/80 dark:text-foreground/70">
        {renderAbstract()}
      </div>
      {data.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.categories.map((c, index) => {
            return (
              <Link
                href={`/category/${data.category_ids[index]}`}
                target="_blank"
                key={index}
                className="text-secondary text-xs border border-secondary font-bold rounded-lg p-2 hover:bg-secondary/10 transition-all"
              >
                {c} ({data.category_ids[index]})
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScholarlyArticleCard;
