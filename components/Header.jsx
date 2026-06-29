import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="promo">
        Gratis ongkir untuk order pertama · pakai kode <b>DOMANIC10</b> buat 10% off
      </div>
      <header>
        <div className="wrap nav">
          <Link className="brand" href="/">DOMANIC</Link>
          <nav className="nav__links">
            <Link href="/#collection">Collection</Link>
            <Link href="/persona">Find Your Persona</Link>
            <Link href="/#why">Why Domanic</Link>
            <Link href="/#story">Our Story</Link>
          </nav>
          <Link className="nav__cart" href="/#collection">Bag (0)</Link>
        </div>
      </header>
    </>
  );
}
