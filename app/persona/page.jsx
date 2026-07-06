import PersonaQuiz from "@/components/PersonaQuiz";

export const metadata = {
  title: "Find Your Persona · DOMANIC",
  description: "Jawab beberapa pertanyaan, temukan Domanic yang paling kerasa kamu.",
};

export default function PersonaPage() {
  return (
    <section className="qzpage">
      <div className="qzpage__bg" aria-hidden="true">
        <img className="qzbg qzbg--tl" src="/images/quiz/quiz-velvet.webp" alt="" />
        <img className="qzbg qzbg--tr" src="/images/quiz/quiz-lily.webp" alt="" />
        <img className="qzbg qzbg--bl" src="/images/quiz/quiz-whisper.webp" alt="" />
        <img className="qzbg qzbg--br" src="/images/quiz/quiz-oud.webp" alt="" />
      </div>
      <div className="qzpage__box">
        <div className="qz__head">
          <p className="eyebrow">Find your persona</p>
          <h1>Wangi mana yang paling kamu?</h1>
          <p>Empat pertanyaan singkat. Kami cariin Domanic yang paling kerasa kamu.</p>
        </div>
        <PersonaQuiz />
      </div>
    </section>
  );
}
