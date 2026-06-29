import PersonaQuiz from "@/components/PersonaQuiz";

export const metadata = {
  title: "Find Your Persona · DOMANIC",
  description: "Jawab beberapa pertanyaan, temukan Domanic yang paling kerasa kamu.",
};

export default function PersonaPage() {
  return (
    <div className="wrap qz">
      <div className="qz__head">
        <p className="eyebrow">Find your persona</p>
        <h1>Wangi mana yang paling kamu?</h1>
        <p>Empat pertanyaan singkat. Kami cariin Domanic yang paling kerasa kamu.</p>
      </div>
      <PersonaQuiz />
    </div>
  );
}
