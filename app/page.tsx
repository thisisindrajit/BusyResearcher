import CSearchBar from "@/components/common/CSearchBar";
import TopBar from "@/components/common/TopBar";
import { Separator } from "@/components/ui/separator";
import { IApiResponse } from "@/interfaces/IApiResponse";
import { abbreviateNumber } from "@/lib/utils";
import { ITotalCountData } from "./api/getTotalCount/route";
import Footer from "@/components/common/Footer";

async function getTotalCountFromApi(): Promise<IApiResponse<ITotalCountData>> {
  // We need to provide the full URL here because this function is called in the server
  const apiResponse = await fetch(`${process.env.BASE_URL}/api/getTotalCount`, {
    next: { revalidate: 900 }, // Revalidate every 15 minutes
  });

  const jsonResponse: IApiResponse<ITotalCountData> = await apiResponse.json();

  if (!jsonResponse.success) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(
      jsonResponse.message || "Some error occurred while fetching total count!"
    );
  }

  return jsonResponse;
}

const Home = async () => {
  const totalCountData: IApiResponse<ITotalCountData> =
    await getTotalCountFromApi();

  return (
    <>
      <TopBar />
      {/* Motto and search bar */}
      <div className="min-h-[50dvh] my-12 flex flex-col gap-4">
        <div className="flex flex-col flex-grow items-center justify-center gap-4 md:gap-6">
          {/* Motto */}
          <div className="text-3xl/snug lg:text-4xl/snug xl:text-5xl/snug">
            <span className="font-bold">Intelligent search</span> for{" "}
            <span className="text-primary">busy researchers.</span>
          </div>
          {/* Search bar */}
          <CSearchBar />
          {totalCountData.success && (
            <div className="bg-secondary/10 text-secondary leading-relaxed p-2 text-center w-full sm:w-4/5 lg:w-fit">
              Semantically search across{" "}
              <span className="font-bold">
                {abbreviateNumber(totalCountData.data.count)}
              </span>{" "}
              scholarly articles from arXiv spanning various categories!
            </div>
          )}
        </div>
      </div>
      {/* What is busy researcher? */}
      <div className="flex flex-col gap-4">
        <div className="text-xl/snug lg:text-2xl/snug xl:text-3xl/snug">
          What is{" "}
          <span className="font-bold text-primary">BusyResearcher?</span>
        </div>
        <Separator className="bg-gradient-to-r from-foreground to-background" />
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
              arXiv
            </a>
            , the popular preprint repository containing millions of scholarly
            articles across STEM fields.
          </p>
          <p>
            While arXiv has grown exponentially over the years, researchers
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
            arXiv. Users can save papers to curated collections and see which
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
          <div className="bg-primary w-fit text-background">
            Thank you to arXiv for use of its open access interoperability.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
