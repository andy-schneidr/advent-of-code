
if (process.argv.length !== 3) {
    console.log("Usage: node scaffold.js <day>");
    process.exit(1);
}
const day = process.argv[2];
console.log(`Scaffolding day ${day}`);


// Duplicate the contents of the template directory, renaming it day<day>
// and useDayX.tsx to useDay<day>.tsx
// Also change any instances of "useDayX" to "useDay<day>"
const fs = require('fs');
const path = require('path');

const templateDir = path.join(__dirname, 'src/components/template');
const dayDir = path.join(__dirname, `src/components/useDay${day}`);
const templateIoDir = path.join(__dirname, 'public/io/template');
const dayIoDir = path.join(__dirname, `public/io/useDay${day}`);
const useDayX = `useDayX`;
const useDayXFile = `useDayX.tsx`;
const useDayXRegex = new RegExp(useDayX, 'g');

const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            copyDir(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
};

copyDir(templateDir, dayDir);
copyDir(templateIoDir, dayIoDir);

// in dayDir, rename useDayX.tsx to useDay<day>.tsx
fs.renameSync(path.join(dayDir, useDayXFile), path.join(dayDir, useDayXFile.replace('X', day)));

// in the useDay<day>.tsx file, replace all instances of useDayX with useDay<day>
const useDayXFileContents = fs.readFileSync(path.join(dayDir, useDayXFile.replace('X', day)), 'utf8');
const useDayXFileContentsReplaced = useDayXFileContents.replace(useDayXRegex, `useDay${day}`);
fs.writeFileSync(path.join(dayDir, useDayXFile.replace('X', day)), useDayXFileContentsReplaced, 'utf8');
