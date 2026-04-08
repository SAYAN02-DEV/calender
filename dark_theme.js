const fs = require('fs');
const files = ['app/page.tsx', 'components/Calendar.tsx', 'components/HeroImage.tsx', 'components/MonthlyMemos.tsx', 'app/layout.tsx'];
const replacements = [
  { p: /bg-white/g, r: 'bg-[#1e1e1e]' },
  { p: /bg-\[#f8f9f7\]/g, r: 'bg-[#252525]' },
  { p: /text-\[#114232\]/g, r: 'text-emerald-400' },
  { p: /text-\[#396253\]/g, r: 'text-emerald-300' },
  { p: /bg-\[#114232\]/g, r: 'bg-emerald-700' },
  { p: /hover:bg-\[#0a291f\]/g, r: 'hover:bg-emerald-600' },
  { p: /text-gray-800/g, r: 'text-gray-200' },
  { p: /text-gray-600/g, r: 'text-gray-400' },
  { p: /border-gray-100/g, r: 'border-[#333]' },
  { p: /border-gray-200/g, r: 'border-[#444]' },
  { p: /border-gray-300/g, r: 'border-[#555]' },
  { p: /bg-gray-100/g, r: 'bg-[#2a2a2a]' },
  { p: /bg-gray-200/g, r: 'bg-[#333]' },
  { p: /bg-gray-50/g, r: 'bg-[#222]' },
  { p: /hover:bg-gray-100/g, r: 'hover:bg-[#3a3a3a]' },
  { p: /hover:bg-gray-200/g, r: 'hover:bg-[#444]' },
  { p: /shadow-sm/g, r: 'shadow-md shadow-black/40' },
  { p: /text-\[#B49B57\]/g, r: 'text-yellow-500' },
  { p: /<body className="/g, r: '<body className="bg-[#121212] text-gray-100 ' },
];
for (const f of files) {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    for (const {p, r} of replacements) {
      c = c.replace(p, r);
    }
    fs.writeFileSync(f, c);
  }
}
