const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const tag = execSync('git describe --tags --abbrev=0').toString().trim();
const hash = execSync('git rev-parse --short HEAD').toString().trim();

// Wir bauen es exakt zusammen: Tag + "-g" + Hash
const finalVersion = "v2.4.1-chilling_bee"; // Genau wie in CMakeLists.txt

const outputPath = path.join(__dirname, 'dist', 'axe-os', 'version.txt');
fs.writeFileSync(outputPath, finalVersion);

console.log(`Generated ${outputPath} with version ${finalVersion}`);