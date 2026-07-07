const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
    // Holt den exakten Git-Output: v2.4.1_chilling_bee-1-g36cfa6a8
    let gitVersion = execSync('git describe --tags --always').toString().trim();
    
    // ÄNDERUNG: Wir lassen den String exakt so, wie Git ihn liefert.
    // Kein .replace('-', '_') mehr!
    let finalVersion = gitVersion;

    const outputPath = path.join(__dirname, 'dist', 'axe-os', 'version.txt');
    
    if (!fs.existsSync(path.dirname(outputPath))){
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    
    fs.writeFileSync(outputPath, finalVersion);
    console.log(`Version exakt synchronisiert auf: ${finalVersion}`);
} catch (error) {
    console.error("Fehler beim Abrufen der Git-Version:", error);
}