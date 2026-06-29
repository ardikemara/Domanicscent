import Hero from "@/components/Hero";
import {
  Collection,
  PersonaTeaser,
  WhyDomanic,
  Story,
  Reassurance,
  Newsletter,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Collection />
      <PersonaTeaser />
      <WhyDomanic />
      <Story />
      <Reassurance />
      <Newsletter />
    </>
  );
}
