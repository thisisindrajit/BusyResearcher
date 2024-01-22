import Link from "next/link";
import { FC } from "react";

interface ICategoriesProps {
  categories: string[];
  category_ids: string[];
}

const Categories: FC<ICategoriesProps> = ({ categories, category_ids }) => {
  return (
    categories.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {categories.map((c: string, index: number) => {
          return (
            <Link
              href={`/category/${category_ids[index]}`}
              target="_blank"
              key={index}
              className="text-secondary text-xs border border-secondary font-bold rounded-lg p-2 hover:bg-secondary/10 transition-all"
            >
              {c} ({category_ids[index]})
            </Link>
          );
        })}
      </div>
    )
  );
};

export default Categories;
