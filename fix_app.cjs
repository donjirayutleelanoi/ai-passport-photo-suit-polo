const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const fixed = content.replace(
    /\{gender === Gender\.FEMALE && \(\s*<div className="sm:col-span-2 p-4 bg-white\/60 rounded-xl border border-rose-100 space-y-4 shadow-sm">/,
    '{clothingType === ClothingType.SUIT && (\n                               <div className={`sm:col-span-2 p-4 bg-white/60 rounded-xl border space-y-4 shadow-sm ${gender === Gender.FEMALE ? "border-rose-100" : "border-indigo-100"}`}>'
);
fs.writeFileSync('App.tsx', fixed);
