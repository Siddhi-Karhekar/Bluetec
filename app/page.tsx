import Hero from "@/components/home/Hero";
import HappyFamilies from "@/components/home/HappyFamilies";
import Journey from "@/components/home/Journey";
import MeetThePups from "@/components/home/MeetThePups";
import Passport from "@/components/home/Passport";
import Questions from "@/components/home/Questions";
import TwoWays from "@/components/home/TwoWays";
import WelcomeHome from "@/components/home/WelcomeHome";

/**
 * Home: one continuous "day" — the sky darkens from morning (hero) to
 * night (questions) and ends at the front door of the TeddyPups house.
 */
export default function HomePage() {
  return (
    <div data-page="home" className="tp-page">
      <div data-section="hero">
        <Hero />
      </div>
      <div data-section="meet">
        <MeetThePups />
      </div>
      <div data-section="paths">
        <TwoWays />
      </div>
      <div data-section="journey">
        <Journey />
      </div>
      <div data-section="trust">
        <Passport />
      </div>
      <div data-section="families">
        <HappyFamilies />
      </div>
      <div data-section="questions">
        <Questions />
      </div>
      <div data-section="cta">
        <WelcomeHome />
      </div>
    </div>
  );
}
