import { FileBox } from 'file-box'
import { repo24 } from "./24.js";
import { repoFeng } from "./fafeng.js";
import { repoBullshit } from './bullshit.js';
import { repoRuozhi } from './ruozhi.js';
import fs from 'fs'

// 遍历diaotu文件夹下所有文件
// const diaotu = fs.readdirSync('src/assets/diaotu').map(file => FileBox.fromFile(`src/assets/diaotu/${file}`))
const diaotu = fs.readdirSync('src/assets/diaotu')

export { repo24, repoFeng, repoBullshit, repoRuozhi, diaotu };