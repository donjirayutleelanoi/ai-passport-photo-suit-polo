const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const searchStr = '{gender === Gender.MALE && (\n                               <div className="sm:col-span-2 p-4 bg-white/60 rounded-xl border border-indigo-100 space-y-4 shadow-sm">\n                                 <label className="block text-[11px] font-bold text-indigo-700 uppercase">รายละเอียดชุดสูทชาย (Male Suit Details)</label>';
const replaceStr = '{gender === Gender.MALE && innerButtonState === InnerButtonState.BUTTONED && innerShirtType === FemaleInnerShirtType.SHIRT && (\n                               <div className="sm:col-span-2 p-4 bg-white/60 rounded-xl border border-indigo-100 space-y-4 shadow-sm">\n                                 <label className="block text-[11px] font-bold text-indigo-700 uppercase">รายละเอียดเนคไท (Necktie Details)</label>';

// Since I have spaces issues, I'll use regex for the spaces
const regex = /\{gender === Gender\.MALE && \(\s*<div className="sm:col-span-2 p-4 bg-white\/60 rounded-xl border border-indigo-100 space-y-4 shadow-sm">\s*<label className="block text-\[11px\] font-bold text-indigo-700 uppercase">รายละเอียดชุดสูทชาย \(Male Suit Details\)<\/label>/;

const fixed = content.replace(regex, replaceStr);
fs.writeFileSync('App.tsx', fixed);
