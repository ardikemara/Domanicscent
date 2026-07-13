import PromoPopup from "@/components/PromoPopup";

// Layout semua halaman journal (index + artikel): konten normal + popup promo
// (exit-intent di desktop, timer di mobile).
export default function JournalLayout({ children }) {
  return (
    <>
      {children}
      <PromoPopup />
    </>
  );
}
