"use client";

import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { abbreviateNumber } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

const Home = () => {
  const articlesCount = 1234567;
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <>
      {/* Topbar, motto and search bar */}
      <div className="h-[75dvh] flex flex-col gap-4">
        <TopBar />
        <div className="flex flex-col flex-grow items-center justify-center gap-4 md:gap-8">
          {/* Motto */}
          <div className="text-3xl/snug lg:text-4xl/snug xl:text-5xl/snug">
            <span className="font-bold">Intelligent search</span> for{" "}
            <span className="text-primary">busy researchers.</span>
          </div>
          {/* Search bar */}
          <div className="w-full sm:w-4/5 lg:w-3/5">
            <div className="border border-foreground flex items-center gap-1 p-1.5 rounded-[0.9rem] w-full">
              <input
                ref={ref}
                type="text"
                placeholder="Search for any topic..."
                className="p-2 bg-background outline-none flex-grow"
                maxLength={200}
              />
              <Button className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2">
                <Search className="h-3.5 w-3.5 mb-0.5" />
                <span className="hidden sm:block">Search</span>
              </Button>
            </div>
          </div>
          <div className="bg-secondary/10 text-secondary leading-relaxed p-2 text-center w-full sm:w-4/5 lg:w-fit">
            Semantically search across{" "}
            <span className="font-bold">{abbreviateNumber(articlesCount)}</span>{" "}
            scholarly articles from Arxiv spanning various categories!
          </div>
        </div>
      </div>
      {/* What is busy researcher? */}
      <div className="flex flex-col gap-4">
        <div className="text-xl/snug lg:text-2xl/snug xl:text-3xl/snug">
          What is{" "}
          <span className="font-bold text-primary">BusyResearcher?</span>
        </div>
        <Separator />
        <div className="flex flex-col gap-8 text-justify leading-loose text-lg">
          <p>
            BusyResearcher is an innovative platform aiming to{" "}
            <span className="text-primary bg-primary/25 font-bold">
              improve the search and discovery experience for academic
              researchers.
            </span>{" "}
            It specifically focuses on{" "}
            <a
              href="https://arxiv.org/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-primary underline"
            >
              Arxiv
            </a>
            , the popular preprint repository containing millions of scholarly
            articles across STEM fields.
          </p>
          <p>
            While Arxiv has grown exponentially over the years, researchers
            often struggle to sift through this vast database to find articles
            relevant to their work. BusyResearcher brings the power of{" "}
            <span className="font-bold">semantic search</span> to tackle this
            problem. It utilizes machine learning algorithms to index articles
            by concepts rather than just keywords.{" "}
            <span className="text-primary bg-primary/25 font-bold">
              This enables researchers to find papers dealing with specific
              ideas, methods or topics more efficiently.
            </span>
          </p>
          {/* <p>
            In addition, BusyResearcher also has a social aspect lacking in
            arxiv. Users can save papers to curated collections and see which
            articles are trending based on likes and shares. This fosters an
            interactive environment to evaluate the significance of papers.
            Researchers can leverage crowdsourced ratings to supplement metrics
            like citations which take years to accumulate. The platform aims to
            keep researchers up-to-date on cutting edge developments in a more
            engaging fashion. 
          </p> 
          <p>
            By blending semantic search with social curation features,
            BusyResearcher aspires to make traversing massive academic databases
            easier. It wants to not just assist discovery but also aid
            evaluation to solve key pain points in the research workflow. The
            vision is to move closer to democratized, collective intelligence
            for advancing science.
          </p> */}
          <p>
            By using semantic search, BusyResearcher aspires to make traversing
            massive academic databases easier and more meaningful. It wants to
            not just assist discovery but also aid evaluation to solve key pain
            points in the research workflow.{" "}
            <span className="text-primary bg-primary/25 font-bold">
              The vision is to move closer to democratized, collective
              intelligence for advancing science.
            </span>
          </p>
          <div className="bg-primary w-fit text-background dark:text-foreground">
            Thank you to arXiv for use of its open access interoperability.
          </div>
        </div>
      </div>
      {/* Copyright banner */}
      <div className="fixed bg-secondary-foreground border-x border-t border-foreground/25 p-2 right-4 lg:right-6 bottom-0 text-sm">
        Copyright © {new Date().getFullYear()}, BusyResearcher
      </div>
    </>
  );
};

export default Home;
