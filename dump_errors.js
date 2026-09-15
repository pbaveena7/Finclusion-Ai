const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync('npm run build', { cwd: 'c:\\Users\\NAVEEN\\Desktop\\sip\\finclusion-ai-2\\frontend', encoding: 'utf-8' });
  fs.writeFileSync('c:\\Users\\NAVEEN\\Desktop\\sip\\ts_errors.log', 'SUCCESS\n' + result);
} catch (e) {
  fs.writeFileSync('c:\\Users\\NAVEEN\\Desktop\\sip\\ts_errors.log', 'ERROR\n' + e.stdout + '\n' + e.stderr);
}
