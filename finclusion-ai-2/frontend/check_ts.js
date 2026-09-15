const { exec } = require('child_process');
const fs = require('fs');

exec('npx tsc --noEmit', { cwd: 'c:\\Users\\NAVEEN\\Desktop\\sip\\finclusion-ai-2\\frontend' }, (error, stdout, stderr) => {
  fs.writeFileSync('c:\\Users\\NAVEEN\\Desktop\\sip\\finclusion-ai-2\\frontend\\ts_error.log', stdout + stderr + (error ? '\nError: ' + error.message : ''));
  console.log('Done');
});
