import TopBar from "@/components/TopBar";

const Home = () => {
  return (
    <>
      <div className="h-[75dvh] flex flex-col gap-4">
        <TopBar />
        <div className="flex flex-col flex-grow items-center justify-center gap-8">
          <div className="text-5xl leading-snug">
            <span className="font-bold">Intelligent search</span> for{" "}
            <span className="text-primary">busy researchers.</span>
          </div>
          <div>Search bar goes here...</div>
        </div>
      </div>
    </>
  );
};

export default Home;
