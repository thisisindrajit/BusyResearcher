import { FC } from "react";

interface IAuthorsProps {
  authors: string[];
}

const Authors: FC<IAuthorsProps> = ({ authors }) => {
  const maxNoOfAuthorsThatCanBeShown = 20;

  return (
    authors.length > 0 && (
      <div className="leading-loose">
        {authors
          .slice(0, maxNoOfAuthorsThatCanBeShown)
          .map((a: string, index: number) => {
            return (
              <span key={index} className="font-bold">
                {a}
                {index !==
                  authors.slice(0, maxNoOfAuthorsThatCanBeShown).length - 1 &&
                  ", "}
              </span>
            );
          })}
        {authors.length > maxNoOfAuthorsThatCanBeShown && (
          <span className="font-bold">
            {` and ${authors.length - maxNoOfAuthorsThatCanBeShown} ${
              authors.length - maxNoOfAuthorsThatCanBeShown > 1
                ? "authors"
                : "author"
            } `}
          </span>
        )}
      </div>
    )
  );
};

export default Authors;
