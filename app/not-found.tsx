import Link from "next/link";
import Teddy from "@/components/Teddy";

export default function NotFound() {
  return (
    <div className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene"
        style={{ "--sky-top": "#fffdf8", "--sky-bottom": "#fbe3b4" }}
      >
        <div className="gutter mx-auto grid max-w-[110rem] items-center gap-10 pb-24 pt-16 md:grid-cols-2">
          <div>
            <p className="font-scrawl text-lg text-toffee-ink">hm? this page wandered off</p>
            <h1 className="font-plush text-giant">Lost puppy</h1>
            <p className="text-lede mt-6 max-w-[40ch] text-cocoa-soft">
              Teddy sniffed everywhere but couldn&apos;t find that page. Let&apos;s get you back to the pups.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/puppies">
                See available puppies
              </Link>
              <Link className="btn btn-ghost" href="/">
                Back home
              </Link>
            </div>
          </div>
          <Teddy pose="play" className="mx-auto w-56 md:w-72" label="Teddy, ready to play" />
        </div>
      </section>
    </div>
  );
}
