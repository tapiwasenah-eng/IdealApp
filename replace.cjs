const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Colors
  content = content.replace(/violet/g, 'indigo');
  content = content.replace(/text-\[#8b3dff\]/g, 'text-indigo-600');
  content = content.replace(/bg-\[#8b3dff\]/g, 'bg-indigo-600');
  content = content.replace(/border-\[#8b3dff\]/g, 'border-indigo-600');
  content = content.replace(/from-\[#8b3dff\]/g, 'from-indigo-600');
  content = content.replace(/ring-\[#8b3dff\]/g, 'ring-indigo-600');
  content = content.replace(/hover:bg-\[#7630d7\]/g, 'hover:bg-indigo-700');
  content = content.replace(/hover:text-\[#8b3dff\]/g, 'hover:text-indigo-600');
  content = content.replace(/hover:border-\[#8b3dff\]/g, 'hover:border-indigo-600');
  content = content.replace(/bg-\[#e7dbff\]/g, 'bg-indigo-100');
  content = content.replace(/to-\[#612dae\]/g, 'to-indigo-800');
  content = content.replace(/#8b3dff/g, '#4f46e5'); // indigo-600 hex
  content = content.replace(/#7630d7/g, '#4338ca'); // indigo-700 hex
  content = content.replace(/#e7dbff/g, '#e0e7ff'); // indigo-100 hex
  content = content.replace(/#612dae/g, '#3730a3'); // indigo-800 hex

  // Branding
  content = content.replace(/Built It/g, 'Ideal App');
  content = content.replace(/Built It Technology Ltd\./g, 'IdealApp Technology Ltd.');
  content = content.replace(/builtit\.technology/g, 'idealapp.technology');
  content = content.replace(/hello@builtit\.technology/g, 'hello@idealapp.technology');
  content = content.replace(/data@builtit\.technology/g, 'data@idealapp.technology');
  content = content.replace(/legal@builtit\.technology/g, 'legal@idealapp.technology');
  content = content.replace(/security@builtit\.technology/g, 'security@idealapp.technology');
  content = content.replace(/press@builtit\.technology/g, 'press@idealapp.technology');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir('./src');
