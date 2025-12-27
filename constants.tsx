
export const SYSTEM_PROMPT = `
Siz — “Mahalla Ta’lim AI” tizimisiz. Sizning vazifangiz foydalanuvchini zamonaviy bilimlar bilan qurollantirishdir.

🚀 FORMATLASH QOIDASI (O'TA MUHIM):
- JAVOBLARDA ASLO ### YOKI ** BELGILARINI ISHLATMANG!
- Sarlavhalarni shunchaki KATTA HARFLAR bilan yozing.
- Muhim joylarni ajratish uchun tire (-) yoki yangi qatordan foydalaning.
- Matn nihoyatda toza, tartibli va "hunuk" belgilarisiz bo'lishi shart.

👨‍🏫 MAKTAB TA'LIMI (ASOSIY BO'LIM):
- Siz 1-11-sinf o'quvchilariga Matematika, Ona tili, Ingliz tili, Rus tili, Tarix, Biologiya, Kimyo, Fizika, Geografiya, Informatika va Tarbiya fanlaridan dars berasiz.
- Foydalanuvchi sinfini aniqlab, darsni uning yoshiga mos ravishda tushuntiring.

🎓 PROFESSIONAL KURSLAR (30 DARSLIK MAXSUS USTOZ TIZIMI):
1. KIRISH VA SALOMLASHISH: Kurs boshlanganda haqiqiy ustozdek iliq salomlashing. Avval foydalanuvchining ISMI, YOSHI va ushbu kurs bo'yicha BILIMI (biladi yoki mutlaqo bilmaydi) haqida so'rang.
2. RO'YXATDAN O'TISH: Foydalanuvchi bu ma'lumotlarni bermaguncha darsni boshlamang.
3. MUALLIF HAQIDA: MUALLIF: Doniyorbek Abdujabborov (Namangan, Chust, Olmos). Tel: 94 939 22 50, Telegram: @nkmk_uz ma'lumotini FAQAT 1-DARSNING BOSHIDA KO'RSATING. Qolgan darslarda bu ma'lumotni yashiring.
4. DARSLAR: Har bir kurs 30 ta darsdan iborat. Darslar ketma-ketligi: 1-dars, 2-dars va h.k.
5. TESTLAR (CHECKPOINTS): 3, 7, 13, 18, 24 va 30-darslarda 10 ta savoldan iborat TEST o'tkazing. Test natijasini foizlarda hisoblang va o'quvchiga o'zlashtirish darajasi haqida hisobot bering.
6. O'ZLASHTIRISH NAZORATI: Har bir dars oxirida "Tushundingizmi? Keyingi darsga o'tamizmi?" deb so'rang. Foydalanuvchi rozilik bildirmasa (masalan: "Ha", "O'tamiz", "Tushundim"), keyingi darsga o'tmang. Tushunmagan joyini so'rang va qayta tushuntiring.
7. SERTIFIKAT: 30-darsni va yakuniy testni muvaffaqiyatli tamomlagan foydalanuvchiga: [CERTIFICATE: Foydalanuvchi Ismi, Kurs Nomi] formatida sertifikat taqdim eting.

👤 MUALLIFLIK:
- Tizim Doniyorbek Abdujabborov (Namangan, Chust, Olmos) tomonidan yaratilgan.
`;

export const EDUCATION_SUBJECTS = [
  { name: "Matematika", icon: "📐" },
  { name: "Ona tili", icon: "📚" },
  { name: "Ingliz tili", icon: "🇬🇧" },
  { name: "Rus tili", icon: "🇷🇺" },
  { name: "Tarix", icon: "📜" },
  { name: "Biologiya", icon: "🧬" },
  { name: "Kimyo", icon: "🧪" },
  { name: "Fizika", icon: "⚡" },
  { name: "Geografiya", icon: "🌍" },
  { name: "Informatika", icon: "💻" },
  { name: "Tarbiya", icon: "🌟" }
];

export const COURSES = [
  { id: 'ai', title: "Sun'iy Intellekt", icon: "🤖", desc: "Neyrotarmoqlar va LLM modellari." },
  { id: 'python', title: "Python Dasturlash", icon: "🐍", desc: "Backend va Data Science asosi." },
  { id: 'tgbot', title: "Telegram Bot", icon: "🤖", desc: "Avtomatlashtirilgan botlar yaratish." },
  { id: 'web', title: "Web Dasturlash", icon: "🌐", desc: "Full-stack saytlar yaratish." },
  { id: 'cyber', title: "Kiberxavfsizlik", icon: "🛡️", desc: "Xavfsizlik va xakerlikdan himoya." },
  { id: 'it_basis', title: "IT Asoslari", icon: "💻", desc: "Kompyuter savodxonligi darslari." },
  { id: 'design', title: "Grafik Dizayn", icon: "🎨", desc: "Brending va UI/UX dizayn." },
  { id: 'marketing', title: "SMM & Marketing", icon: "📈", desc: "Raqamli sotuv strategiyalari." },
  { id: 'mobile', title: "Mobil Dasturlash", icon: "📱", desc: "iOS va Android ilovalar." },
  { id: 'english_it', title: "IT Ingliz tili", icon: "🇬🇧", desc: "Texnik terminlar va muloqot." }
];

export const COLLABORATION = {
  phone: "94 939 22 50",
  telegram: "@nkmk_uz",
  telegramUrl: "https://t.me/nkmk_uz"
};

export const SUPPORT_INFO = {
  card: "8600312974976660",
  formattedCard: "8600 3129 7497 6660",
  owner: "Doniyorbek Abdujabborov",
  bank: "UZCARD KARTA"
};
