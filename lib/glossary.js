// Kamus Istilah Parfum. Linkable asset: definisi netral, ensiklopedis,
// TANPA promosi brand. Jangan sebut Domanic di definisi manapun.
// Copy campuran Indonesia + English, no em-dash.

export const glossaryCategories = [
  { id: "konsentrasi", name: "Konsentrasi" },
  { id: "struktur", name: "Struktur Aroma" },
  { id: "proses", name: "Proses Pembuatan" },
  { id: "performa", name: "Performa" },
  { id: "keluarga", name: "Keluarga Aroma" },
  { id: "bahan", name: "Bahan" },
  { id: "pasar", name: "Istilah Pasar" },
  { id: "slang", name: "Slang Komunitas Indonesia" },
];

export const glossaryTerms = [
  // ---- Konsentrasi (5) ----
  {
    id: "extrait-de-parfum",
    term: "Extrait de Parfum",
    aka: "Parfum, Pure Perfume",
    category: "konsentrasi",
    definition:
      "Konsentrasi parfum paling tinggi yang umum dijual, dengan kadar minyak wangi sekitar 20 sampai 40 persen. Aromanya lebih dalam, lebih halus, dan bertahan paling lama di kulit dibanding konsentrasi lain. Karena pekat, biasanya cukup dipakai 2 sampai 4 semprot.",
    distinction:
      "Bedanya dengan EDP: extrait lebih pekat, proyeksinya cenderung lebih dekat ke kulit, dan ketahanannya lebih panjang.",
    related: { label: "Apa itu Extrait de Parfum", href: "/journal/apa-itu-extrait-de-parfum" },
  },
  {
    id: "eau-de-parfum",
    term: "Eau de Parfum (EDP)",
    category: "konsentrasi",
    definition:
      "Konsentrasi parfum dengan kadar minyak wangi sekitar 15 sampai 20 persen. Ini standar parfum modern: cukup kuat untuk bertahan setengah hari sampai seharian, tapi masih lebih ringan dari extrait. Kebanyakan parfum niche dan designer dijual dalam bentuk EDP.",
    related: { label: "Perbedaan EDP dan EDT", href: "/journal/perbedaan-edp-dan-edt" },
  },
  {
    id: "eau-de-toilette",
    term: "Eau de Toilette (EDT)",
    category: "konsentrasi",
    definition:
      "Konsentrasi parfum dengan kadar minyak wangi sekitar 5 sampai 15 persen. Karakternya ringan dan segar, cocok untuk siang hari, tapi lebih cepat menguap sehingga sering perlu re-apply, apalagi di iklim panas dan lembap.",
    related: { label: "Perbedaan EDP dan EDT", href: "/journal/perbedaan-edp-dan-edt" },
  },
  {
    id: "eau-de-cologne",
    term: "Eau de Cologne (EDC)",
    aka: "Cologne",
    category: "konsentrasi",
    definition:
      "Konsentrasi paling ringan, dengan kadar minyak wangi sekitar 2 sampai 5 persen. Biasanya beraroma citrus segar dan dipakai untuk kesegaran singkat. Nama cologne berasal dari kota Koln di Jerman, tempat resep aslinya lahir di awal abad 18.",
    distinction:
      "Di percakapan sehari-hari, cologne sering dipakai untuk menyebut parfum pria secara umum. Secara teknis, cologne adalah tingkat konsentrasi, bukan gender.",
  },
  {
    id: "parfum-oil",
    term: "Parfum Oil",
    aka: "Perfume Oil, Attar",
    category: "konsentrasi",
    definition:
      "Parfum berbasis minyak tanpa alkohol, biasanya dioles langsung ke kulit, bukan disemprot. Aromanya duduk sangat dekat ke kulit dan menguap pelan. Tradisi attar di Timur Tengah dan Asia Selatan adalah bentuk parfum oil yang sudah berumur ratusan tahun.",
  },

  // ---- Struktur Aroma (7) ----
  {
    id: "notes",
    term: "Notes",
    aka: "Nota Aroma",
    category: "struktur",
    definition:
      "Komponen aroma tunggal yang bisa dikenali dalam sebuah parfum, misalnya bergamot, melati, atau sandalwood. Sebuah parfum adalah komposisi dari banyak notes yang muncul bergantian seiring waktu.",
    related: { label: "Arti Top, Middle, Base Notes", href: "/journal/arti-top-middle-base-notes" },
  },
  {
    id: "top-notes",
    term: "Top Notes",
    aka: "Opening, Kepala",
    category: "struktur",
    definition:
      "Lapisan aroma pertama yang tercium begitu parfum disemprot. Terbuat dari molekul paling ringan, biasanya citrus, buah, atau herbal, dan menguap paling cepat, umumnya dalam 15 sampai 30 menit. Top notes adalah kesan pertama, bukan karakter sebenarnya dari sebuah parfum.",
  },
  {
    id: "middle-notes",
    term: "Middle Notes",
    aka: "Heart Notes, Jantung Aroma",
    category: "struktur",
    definition:
      "Lapisan tengah yang muncul setelah top notes memudar, biasanya bertahan 2 sampai 4 jam. Sering berupa floral atau rempah. Middle notes adalah karakter utama sebuah parfum, alasannya disebut heart.",
  },
  {
    id: "base-notes",
    term: "Base Notes",
    aka: "Dasar Aroma",
    category: "struktur",
    definition:
      "Lapisan paling dasar yang bertahan paling lama, bisa sampai belasan jam. Terbuat dari molekul berat seperti kayu, musk, amber, vanilla, dan resin. Base notes menentukan seberapa awet sebuah parfum di kulit.",
    related: { label: "Arti Top, Middle, Base Notes", href: "/journal/arti-top-middle-base-notes" },
  },
  {
    id: "piramida-aroma",
    term: "Piramida Aroma",
    aka: "Fragrance Pyramid, Olfactory Pyramid",
    category: "struktur",
    definition:
      "Cara standar menggambarkan struktur parfum dalam tiga tingkat: top notes di puncak, middle notes di tengah, base notes di dasar. Piramida menjelaskan urutan aroma muncul, bukan seberapa penting tiap lapisan.",
  },
  {
    id: "accord",
    term: "Accord",
    category: "struktur",
    definition:
      "Gabungan beberapa notes yang diramu sampai menghasilkan satu kesan aroma baru, seperti chord dalam musik. Misalnya accord kulit (leather) sebenarnya tidak berasal dari kulit asli, tapi dari kombinasi beberapa bahan yang bersama-sama tercium seperti kulit.",
  },
  {
    id: "dry-down",
    term: "Dry Down",
    category: "struktur",
    definition:
      "Tahap akhir kehidupan parfum di kulit, saat top dan middle notes sudah menguap dan yang tersisa hanya base notes. Dry down sering disebut wangi paling jujur sebuah parfum, karena inilah aroma yang menemanimu paling lama. Karena itu disarankan menunggu 15 sampai 20 menit sebelum menilai sebuah parfum.",
  },

  // ---- Proses Pembuatan (5) ----
  {
    id: "maserasi",
    term: "Maserasi",
    aka: "Maceration, Resting, Aging",
    category: "proses",
    definition:
      "Proses mengistirahatkan parfum setelah formulanya selesai dicampur, biasanya beberapa minggu, supaya molekul minyak wangi dan alkohol menyatu sempurna sebelum dibotolkan. Parfum yang belum dimaserasi cenderung terasa tajam dan bau alkoholnya menonjol.",
    distinction:
      "Di komunitas Indonesia, istilah ini sering disebut resting. Artinya sama.",
    related: { label: "Apa itu Maserasi Parfum", href: "/journal/maserasi-parfum" },
  },
  {
    id: "fixative",
    term: "Fixative",
    aka: "Fiksatif",
    category: "proses",
    definition:
      "Bahan yang tugasnya memperlambat penguapan molekul aroma lain, sehingga parfum bertahan lebih lama. Contoh fixative klasik: musk, amber, resin benzoin, dan beberapa molekul sintetis modern. Tanpa fixative, aroma paling indah pun cepat hilang.",
  },
  {
    id: "batch",
    term: "Batch",
    category: "proses",
    definition:
      "Satu putaran produksi parfum yang dibuat dalam waktu dan campuran yang sama. Karena bahan alami bisa sedikit bervariasi antar panen, dua batch dari parfum yang sama kadang punya perbedaan aroma yang sangat tipis.",
  },
  {
    id: "batch-code",
    term: "Batch Code",
    category: "proses",
    definition:
      "Kode di kemasan atau botol yang menunjukkan kapan dan di batch mana sebuah parfum diproduksi. Komunitas memakainya untuk mengecek umur parfum dan keaslian produk.",
  },
  {
    id: "nose",
    term: "Nose (Perfumer)",
    aka: "Peracik Parfum",
    category: "proses",
    definition:
      "Sebutan untuk peracik parfum profesional, orang yang menyusun formula aroma. Seorang nose terlatih bisa mengenali ribuan bahan. Di industri, nama nose besar sering jadi daya tarik sebuah rilisan, seperti sutradara di dunia film.",
  },

  // ---- Performa (4) ----
  {
    id: "sillage",
    term: "Sillage",
    aka: "Jejak Aroma",
    category: "performa",
    definition:
      "Jejak aroma yang tertinggal di udara saat kamu berjalan melewati sebuah ruangan. Berasal dari bahasa Perancis yang berarti jejak kapal di air. Sillage besar berarti aromanya terasa dari jarak jauh, sillage kecil berarti aromanya lebih dekat ke kulit dan intim.",
    distinction:
      "Bedanya dengan longevity: sillage soal seberapa jauh aromanya menyebar, longevity soal seberapa lama aromanya bertahan. Sebuah parfum bisa punya longevity panjang tapi sillage kecil.",
  },
  {
    id: "longevity",
    term: "Longevity",
    aka: "Ketahanan",
    category: "performa",
    definition:
      "Berapa lama aroma parfum bertahan di kulit, dihitung dari semprotan pertama sampai tidak lagi tercium. Longevity dipengaruhi konsentrasi, komposisi base notes, jenis kulit, dan cuaca. Di iklim tropis, longevity umumnya lebih pendek karena panas mempercepat penguapan.",
    related: { label: "Cara Pakai Parfum Biar Tahan Lama", href: "/journal/cara-pakai-parfum-biar-tahan-lama" },
  },
  {
    id: "projection",
    term: "Projection",
    aka: "Proyeksi",
    category: "performa",
    definition:
      "Seberapa jauh aroma parfum memancar dari kulit pemakainya saat diam, sering digambarkan sebagai gelembung aroma di sekitar tubuh. Projection kuat berarti orang lain bisa menciumnya dari jarak satu dua meter tanpa mendekat.",
    distinction:
      "Projection diukur saat kamu diam, sillage diukur dari jejak yang kamu tinggalkan saat bergerak.",
  },
  {
    id: "skin-chemistry",
    term: "Skin Chemistry",
    aka: "Kimia Kulit",
    category: "performa",
    definition:
      "Kondisi alami kulit tiap orang, dari pH, kadar minyak, suhu, sampai pola makan, yang membuat parfum yang sama bisa tercium berbeda di orang yang berbeda. Ini alasan parfum sebaiknya dicoba di kulit sendiri, bukan hanya di kertas tester.",
  },

  // ---- Keluarga Aroma (9) ----
  {
    id: "gourmand",
    term: "Gourmand",
    aka: "Aroma Manis Seperti Makanan",
    category: "keluarga",
    definition:
      "Keluarga aroma yang terinspirasi makanan dan minuman: vanilla, cokelat, karamel, kopi, madu. Karakternya manis, hangat, dan nyaman. Keluarga ini relatif muda, baru populer sejak 1990-an, dipelopori parfum bernotes praline dan gula kapas.",
    related: { label: "Apa itu Parfum Gourmand", href: "/journal/parfum-gourmand" },
  },
  {
    id: "woody",
    term: "Woody",
    aka: "Aroma Kayu",
    category: "keluarga",
    definition:
      "Keluarga aroma kayu-kayuan dan akar: sandalwood, cedar, vetiver, oud. Karakternya hangat, kering, dan membumi. Karena molekulnya berat, notes woody sering ada di base dan berperan besar dalam ketahanan sebuah parfum.",
    related: { label: "Apa itu Parfum Woody", href: "/journal/parfum-woody" },
  },
  {
    id: "floral",
    term: "Floral",
    aka: "Aroma Bunga",
    category: "keluarga",
    definition:
      "Keluarga aroma bunga, dari melati, mawar, freesia, sampai peony. Ini keluarga terbesar dan tertua di dunia parfum. Rentangnya luas, dari floral ringan yang transparan sampai white floral yang penuh dan mewah.",
    related: { label: "Apa itu Parfum Floral", href: "/journal/parfum-floral" },
  },
  {
    id: "fresh",
    term: "Fresh",
    aka: "Aroma Segar",
    category: "keluarga",
    definition:
      "Payung untuk aroma yang ringan, bersih, dan lapang: citrus, green (dedaunan), aquatic, dan floral ringan. Keluarga ini paling nyaman dipakai di cuaca panas dan jadi favorit di negara tropis.",
    related: { label: "Apa itu Parfum Fresh", href: "/journal/parfum-fresh" },
  },
  {
    id: "citrus",
    term: "Citrus",
    aka: "Hesperidic",
    category: "keluarga",
    definition:
      "Sub-keluarga fresh yang dibangun dari kulit buah jeruk-jerukan: bergamot, lemon, jeruk mandarin, grapefruit, yuzu. Cerah dan energik, tapi molekulnya ringan sehingga cepat menguap. Hampir selalu ditempatkan di top notes.",
    related: { label: "Apa itu Parfum Fresh", href: "/journal/parfum-fresh" },
  },
  {
    id: "aquatic",
    term: "Aquatic",
    aka: "Marine, Ozonic",
    category: "keluarga",
    definition:
      "Aroma yang meniru kesan air, laut, dan udara sehabis hujan. Biasanya dibangun dari molekul sintetis seperti calone, karena air sendiri tidak punya aroma yang bisa diekstrak. Populer sejak awal 1990-an lewat gelombang parfum bernuansa laut.",
  },
  {
    id: "chypre",
    term: "Chypre",
    category: "keluarga",
    definition:
      "Keluarga aroma klasik yang dibangun dari kontras citrus di pembuka dengan oakmoss, labdanum, dan patchouli di dasar. Namanya dari kata Perancis untuk pulau Siprus. Karakternya elegan, sedikit earthy, dan dianggap salah satu struktur paling canggih di dunia parfum.",
  },
  {
    id: "fougere",
    term: "Fougere",
    category: "keluarga",
    definition:
      "Keluarga aroma yang dibangun dari lavender, geranium, oakmoss, dan coumarin. Namanya berarti pakis dalam bahasa Perancis, meski pakis sendiri tidak beraroma. Ini tulang punggung banyak parfum maskulin klasik, dari sabun cukur sampai barbershop.",
  },
  {
    id: "oriental",
    term: "Oriental (Amber)",
    aka: "Amber",
    category: "keluarga",
    definition:
      "Keluarga aroma yang hangat, manis, dan berat: resin, vanilla, rempah, balsam. Industri kini lebih sering menyebutnya keluarga amber. Karakternya sensual dan paling hidup di malam hari atau cuaca sejuk.",
  },

  // ---- Bahan (11) ----
  {
    id: "oud",
    term: "Oud",
    aka: "Gaharu, Agarwood",
    category: "bahan",
    definition:
      "Resin wangi yang terbentuk di pohon Aquilaria saat pohonnya terinfeksi jamur secara alami. Prosesnya butuh bertahun-tahun dan tidak bisa dipaksa, menjadikan oud salah satu bahan termahal di dunia parfum. Aromanya dalam, hangat, sedikit smoky. Asia Tenggara, termasuk Indonesia, adalah salah satu penghasil gaharu.",
    related: { label: "Parfum untuk The Bold Charmer", href: "/journal/parfum-untuk-the-bold-charmer" },
  },
  {
    id: "musk",
    term: "Musk",
    category: "bahan",
    definition:
      "Aroma dasar yang lembut, hangat, dan bersih seperti kulit. Dulu diambil dari kelenjar rusa musk, kini hampir seluruhnya digantikan musk sintetis yang cruelty-free. Musk adalah salah satu fixative paling umum dan hadir di sangat banyak parfum modern tanpa disadari.",
  },
  {
    id: "ambergris",
    term: "Ambergris",
    aka: "Ambar Abu-abu",
    category: "bahan",
    definition:
      "Zat langka yang dihasilkan sistem pencernaan paus sperma dan mengapung bertahun-tahun di laut sebelum ditemukan di pantai. Aromanya hangat, asin, dan halus, dengan kemampuan fixative luar biasa. Karena langka dan mahal, parfum modern umumnya memakai versi sintetisnya, ambroxan.",
  },
  {
    id: "vetiver",
    term: "Vetiver",
    aka: "Akar Wangi",
    category: "bahan",
    definition:
      "Minyak dari akar rumput vetiver, di Indonesia dikenal sebagai akar wangi. Aromanya earthy, hijau, sedikit smoky. Indonesia termasuk penghasil vetiver dunia, terutama dari Garut, bersama Haiti dan Reunion yang paling terkenal.",
  },
  {
    id: "patchouli",
    term: "Patchouli",
    aka: "Nilam",
    category: "bahan",
    definition:
      "Minyak dari daun tanaman nilam, beraroma earthy, gelap, dan sedikit manis. Indonesia adalah salah satu produsen minyak nilam terbesar di dunia, terutama dari Aceh dan Sulawesi, jadi hampir setiap parfum ber-patchouli di dunia kemungkinan besar memakai panen Indonesia.",
  },
  {
    id: "bergamot",
    term: "Bergamot",
    category: "bahan",
    definition:
      "Jeruk kecil dari Calabria, Italia, yang kulitnya menghasilkan aroma citrus paling elegan di dunia parfum: cerah, sedikit floral, tidak seasam lemon. Bergamot adalah top note paling sering dipakai di industri, dan juga aroma khas teh Earl Grey.",
  },
  {
    id: "sandalwood",
    term: "Sandalwood",
    aka: "Cendana",
    category: "bahan",
    definition:
      "Kayu beraroma creamy, lembut, dan hangat, salah satu bahan parfum tertua di dunia. Cendana dari Nusa Tenggara Timur, Indonesia, termasuk yang paling dicari secara historis, bersama cendana Mysore dari India. Karena penebangan berlebih, industri kini banyak memakai cendana Australia dan versi sintetis.",
    related: { label: "Apa itu Parfum Woody", href: "/journal/parfum-woody" },
  },
  {
    id: "cashmeran",
    term: "Cashmeran",
    aka: "Blonde Woods",
    category: "bahan",
    definition:
      "Molekul sintetis modern beraroma kayu yang halus, hangat, dan sedikit musky, sering digambarkan seperti tekstur kain kasmir. Dipakai untuk memberi kesan woody yang lembut tanpa berat.",
  },
  {
    id: "tonka-bean",
    term: "Tonka Bean",
    aka: "Biji Tonka",
    category: "bahan",
    definition:
      "Biji dari pohon Dipteryx odorata asal Amerika Selatan, beraroma manis creamy dengan sisi almond dan vanilla. Kandungan coumarin-nya menjadikan tonka bahan penting di keluarga gourmand dan fougere.",
  },
  {
    id: "aldehyde",
    term: "Aldehyde",
    category: "bahan",
    definition:
      "Kelompok molekul sintetis yang memberi kesan bersih, bersinar, dan sedikit seperti sabun atau lilin di pembuka parfum. Terkenal lewat parfum klasik tahun 1920-an yang memakai dosis aldehyde besar dan mengubah sejarah parfum modern.",
  },
  {
    id: "iso-e-super",
    term: "Iso E Super",
    category: "bahan",
    definition:
      "Molekul sintetis beraroma kayu transparan yang sangat halus, kadang nyaris tidak tercium oleh pemakainya sendiri tapi terasa oleh orang lain. Dipakai luas untuk memberi volume dan kesan modern, bahkan ada parfum yang isinya hampir hanya molekul ini.",
  },

  // ---- Istilah Pasar (6) ----
  {
    id: "niche",
    term: "Niche",
    category: "pasar",
    definition:
      "Rumah parfum independen yang fokus utamanya membuat parfum, bukan merek fashion yang merilis parfum sebagai produk sampingan. Ciri umumnya: distribusi terbatas, bahan lebih berani, dan arah kreatif yang tidak mengejar selera pasar massal.",
    distinction:
      "Niche bukan jaminan kualitas, dan designer bukan berarti buruk. Bedanya di model bisnis dan arah kreatif, bukan di mutu.",
  },
  {
    id: "designer",
    term: "Designer",
    category: "pasar",
    definition:
      "Parfum yang dirilis merek fashion atau kecantikan besar dan dijual luas di department store. Umumnya dirancang agar mudah disukai banyak orang dan diproduksi dalam skala besar.",
  },
  {
    id: "clone",
    term: "Clone (Dupe)",
    category: "pasar",
    definition:
      "Parfum yang sengaja dibuat menyerupai aroma parfum lain yang lebih mahal atau lebih terkenal, dijual dengan harga jauh lebih murah. Legal selama tidak meniru merek dan kemasan, karena aroma sendiri sulit dipatenkan.",
  },
  {
    id: "decant",
    term: "Decant",
    category: "pasar",
    definition:
      "Parfum asli yang dipindahkan dari botol resminya ke botol kecil, biasanya 5 sampai 10 ml, untuk dijual atau dibagikan. Cara populer mencoba parfum mahal tanpa membeli botol penuh.",
    distinction:
      "Decant berbeda dengan clone: decant adalah cairan asli dalam botol berbeda, clone adalah cairan tiruan.",
  },
  {
    id: "blind-buy",
    term: "Blind Buy",
    category: "pasar",
    definition:
      "Membeli parfum tanpa pernah menciumnya lebih dulu, biasanya hanya berdasarkan review, deskripsi notes, atau hype. Berisiko karena aroma sangat personal, tapi jadi bagian dari keseruan hobi ini.",
  },
  {
    id: "atomizer",
    term: "Atomizer",
    category: "pasar",
    definition:
      "Alat semprot yang memecah cairan parfum menjadi kabut halus. Istilah ini juga dipakai untuk botol semprot kecil isi ulang yang praktis dibawa bepergian.",
  },

  // ---- Slang Komunitas Indonesia (7) ----
  {
    id: "nempel",
    term: "Nempel",
    category: "slang",
    definition:
      "Slang komunitas fragrance Indonesia untuk parfum yang aromanya bertahan lama di kulit atau baju. Kalau orang bilang parfumnya nempel banget, maksudnya longevity-nya bagus.",
  },
  {
    id: "awet",
    term: "Awet",
    category: "slang",
    definition:
      "Sinonim sehari-hari untuk longevity yang panjang. Parfum yang awet berarti masih tercium berjam-jam setelah disemprot, standar yang sering jadi pertimbangan utama pembeli Indonesia karena iklim tropis membuat banyak parfum cepat hilang.",
  },
  {
    id: "meledak",
    term: "Meledak",
    category: "slang",
    definition:
      "Slang untuk parfum yang proyeksinya sangat kuat di semprotan awal, aromanya langsung memenuhi ruangan. Bisa jadi pujian atau keluhan, tergantung konteks dan seleranya.",
  },
  {
    id: "beast-mode",
    term: "Beast Mode",
    category: "slang",
    definition:
      "Istilah komunitas global yang juga dipakai di Indonesia untuk parfum dengan performa ekstrem: proyeksi kencang dan ketahanan belasan jam. Biasanya disematkan ke parfum yang cukup 1 sampai 2 semprot saja.",
  },
  {
    id: "scrubber",
    term: "Scrubber",
    category: "slang",
    definition:
      "Parfum yang begitu tidak cocok di kulit sampai pemakainya ingin langsung menggosoknya hilang di wastafel. Sangat subjektif: scrubber bagi satu orang bisa jadi signature scent bagi orang lain.",
  },
  {
    id: "compliment-getter",
    term: "Compliment Getter",
    category: "slang",
    definition:
      "Parfum yang sering memancing pujian spontan dari orang sekitar. Belum tentu parfum paling mahal atau paling unik, tapi aromanya mudah disukai banyak orang.",
  },
  {
    id: "signature-scent",
    term: "Signature Scent",
    aka: "Wangi Khas",
    category: "slang",
    definition:
      "Parfum yang dipakai seseorang begitu sering sampai aromanya melekat dengan identitasnya. Orang mengenali kehadirannya dari wanginya. Lawannya adalah rotasi, memakai parfum berbeda tergantung suasana.",
  },
];

export function getTermsByCategory(categoryId) {
  return glossaryTerms.filter((t) => t.category === categoryId);
}
