import Link from "next/link";
import CartButton from "@/components/cart/CartButton";

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
            <Link href="/journal">Journal</Link>
          </nav>
          <CartButton />
        </div>
      </header>
    </>
  );
}
