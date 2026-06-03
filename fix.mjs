import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('src'), ...walk('server')];
files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\\`/g, '`');
        content = content.replace(/\\\$/g, '$');
        fs.writeFileSync(file, content);
    }
});
console.log("Done");
