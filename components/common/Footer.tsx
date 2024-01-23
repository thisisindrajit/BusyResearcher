const Footer = () => {
  return (
    /* Copyright banner */
    <div className="w-full flex items-center justify-end md:justify-between text-sm font-bold">
      <div className="hidden md:block">
        Created with ❤️ by{" "}
        <a
          href="https://thisisindrajit.github.io/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary"
        >
          Indrajit
        </a>
      </div>
      <div className="self-end">
        Copyright © {new Date().getFullYear()}, BusyResearcher
      </div>
    </div>
  );
};

export default Footer;
