const { execSync } = require('child_process');
try {
  console.log(execSync('git checkout -- src/pages/MutualFunds.tsx src/pages/Dashboard.tsx src/pages/Safety.tsx src/pages/Schemes.tsx src/pages/Stocks.tsx', { encoding: 'utf-8' }));
} catch (e) {
  console.error(e.message);
}
