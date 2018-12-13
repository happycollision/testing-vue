import * as fs from 'fs';
import * as path from 'path';


const pathToIndex = path.join(__dirname, '..', 'dist', 'index.html')
const file = fs.readFileSync(pathToIndex, {encoding: 'utf-8'});

fs.writeFileSync(pathToIndex, file.replace(/="(\/.*?)"/g, '="https://happycollision.github.io/testing-vue$1"'))