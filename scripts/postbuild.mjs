// 建置後處理：按頁子集化標題字體（需要 python3 及 fonttools、brotli）
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const outDir = process.env.OUT_DIR ?? 'dist';
if (!fs.existsSync(outDir)) { console.error(`${outDir} 不存在`); process.exit(1); }
const base = process.env.BASE ?? '/tang-wei-tea';
const py = process.env.PYTHON ?? 'python3';
const r = spawnSync(py, ['-I', 'scripts/subset_fonts.py', outDir, '--base', base], { stdio: 'inherit' });
if (r.status !== 0) { console.error('字體子集化失敗'); process.exit(r.status ?? 1); }
