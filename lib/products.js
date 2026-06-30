// Central data for Domanic fragrances and personas.
// Note: keep copy mixed Indonesian + English, no em-dashes.

export const products = [
  {
    slug: "velvet-rum",
    name: "Velvet Rum",
    persona: "The Midnight Intellectual",
    character: "Gourmand · Dark · Sensual",
    tagline: "Where desire lingers and sensuality blossoms with time.",
    image: "/images/velvet.jpg",
    price: 329000,
    size: "50 ml",
    concentration: "Extrait De Parfum",
    bestWorn: "Malam hari, me-time, dinner intim",
    notes: {
      top: ["Rum"],
      mid: ["Dark Chocolate", "Coffee", "Almond", "Heliotrope"],
      base: ["Caramel", "Sugar Cane", "Sandalwood", "Vanilla", "Tonka", "Vetiver"],
    },
    noteScene: "/notes/scenes/velvet-rum.jpg",
    noteStory:
      "Velvet Rum dibuka dengan rum yang hangat, manis, sedikit nakal, dan langsung ninggalin kesan. Pelan-pelan muncul kopi dan dark chocolate yang pekat, ditemani almond yang lembut, bikin wanginya makin dalam dan dewasa. Di dasarnya, vanilla, tonka, dan sandalwood menutup semuanya dengan tenang, hangat, dan tahan lama di kulit. Wangi yang nggak teriak, tapi diingat.",
    story:
      "Velvet Rum dibuat untuk jiwa yang tenang tapi dalam. Pembuka rum yang hangat membungkus cokelat gelap dan kopi, lalu mereda jadi karamel dan vanila yang lembut di kulit. Wangi yang nempel di ingatan, seperti percakapan larut malam yang nggak ingin selesai.",
  },
  {
    slug: "lily-wood",
    name: "Lily Wood",
    persona: "The Free-Spirited Explorer",
    character: "Fresh · Floral-Woody · Adventurous",
    tagline: "Like standing between the refreshing scent of flowers and wood.",
    image: "/images/lily.jpg",
    price: 329000,
    size: "50 ml",
    concentration: "Extrait De Parfum",
    bestWorn: "Siang, weekend, aktivitas outdoor",
    notes: {
      top: ["Litchi", "Rhubarb", "Bergamot", "Nutmeg"],
      mid: ["Turkish Rose", "Peony", "Musk", "Petalia", "Vanilla"],
      base: ["Cashmeran", "Incense", "Cedar", "Haitian Vetiver"],
    },
    noteImg: {
      "Litchi": "litchi", "Rhubarb": "rhubarb", "Bergamot": "bergamot", "Nutmeg": "nutmeg",
      "Turkish Rose": "rose", "Peony": "peony", "Musk": "musk", "Petalia": "petalia", "Vanilla": "vanilla",
      "Cashmeran": "cashmeran", "Incense": "incense", "Cedar": "cedar", "Haitian Vetiver": "vetiver",
    },
    noteScene: "/notes/scenes/lily-wood.jpg",
    noteStory:
      "Lily Wood dibuka segar dengan litchi dan bergamot yang cerah, kayak udara pagi pas lagi pengen jalan dan eksplor. Rhubarb kasih sentuhan unik yang sedikit nakal, terus turkish rose dan peony mekar lembut di tengah. Di dasarnya, cedar dan vetiver bikin wanginya tetap membumi, hangat, dan tahan lama. Wangi buat kamu yang nggak betah diam, selalu pengen ke tempat baru.",
    story:
      "Lily Wood adalah udara segar setelah hujan di tengah pepohonan. Litchi dan bergamot yang cerah bertemu mawar dan peony, lalu mendarat di kayu cedar dan vetiver yang membumi. Untuk kamu yang nggak suka diam di satu tempat.",
  },
  {
    slug: "whisper",
    name: "Whisper",
    persona: "The Graceful Muse",
    character: "Soft Floral · Elegant · Feminine",
    tagline: "A soft scent that evokes your elegant presence.",
    image: "/images/whisper.jpg",
    price: 329000,
    size: "50 ml",
    concentration: "Extrait De Parfum",
    bestWorn: "Acara spesial, siang ke malam",
    notes: {
      top: ["Mirabelle", "Pear"],
      mid: ["Egyptian Jasmine", "Dates", "Freesia"],
      base: ["Vanilla", "Sandalwood", "Oakmoss", "Patchouli"],
    },
    noteScene: "/notes/scenes/whisper.jpg",
    noteStory:
      "Whisper dibuka pelan dengan pir dan mirabelle yang lembut dan manis, understated. Lalu egyptian jasmine dan freesia mekar anggun di tengah, bikin wanginya makin halus dan feminin. Di dasarnya, vanilla, sandalwood, dan oakmoss menutup dengan hangat dan tenang. Keanggunan yang nggak perlu bersuara keras, tapi selalu diingat.",
    story:
      "Whisper berbicara pelan tapi diingat. Buah mirabelle dan pir yang lembut membuka jalan untuk melati dan freesia, lalu ditutup vanila dan sandalwood yang hangat. Keanggunan yang nggak perlu berteriak.",
  },
  {
    slug: "oud-majesty",
    name: "Oud Majesty",
    persona: "The Bold Charmer",
    character: "Fruity-Floral · Bold · Magnetic",
    tagline: "Unleash the fragrance that reveals your hidden side.",
    image: "/images/oud.jpg",
    price: 329000,
    size: "50 ml",
    concentration: "Extrait De Parfum",
    bestWorn: "Malam, acara, saat ingin jadi pusat perhatian",
    notes: {
      top: ["Peach", "Apple Blossom"],
      mid: ["Pineapple Blossom"],
      base: ["Wild Rose", "Musk", "Patchouli", "Oud"],
    },
    noteScene: "/notes/scenes/oud-majesty.jpg",
    noteStory:
      "Oud Majesty dibuka berani dengan peach dan apple blossom yang manis dan magnetic, langsung menarik perhatian begitu masuk ruangan. Pineapple blossom nambah percikan yang playful dan beda. Di dasarnya, wild rose, patchouli, dan oud yang dalam menutup semuanya dengan karakter yang kuat dan susah dilupakan. Buat kamu yang nggak butuh banyak kata buat bikin orang menoleh.",
    story:
      "Oud Majesty adalah modern urban luxury. Persik dan apple blossom yang manis bertemu mawar liar dan oud yang dalam, menciptakan tarikan yang sulit diabaikan. Untuk kamu yang masuk ruangan dan semua orang menoleh.",
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
