const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
try {
  require('@babel/core').transformSync(code, { presets: ['@babel/preset-react', '@babel/preset-typescript'] });
  console.log("Syntax is OK");
} catch (e) {
  console.error(e.message);
}
