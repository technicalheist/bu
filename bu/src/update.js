const { execSync } = require('child_process');

async function update() {
  console.log('Checking for updates...');

  const currentVersion = require('../package.json').version;
  console.log(`Current version: ${currentVersion}`);

  try {
    const latestVersion = execSync('npm view @technicalheist/bu version', {
      encoding: 'utf-8',
    }).trim();

    if (currentVersion === latestVersion) {
      console.log(`Already on the latest version (${latestVersion})`);
      return;
    }

    console.log(`New version available: ${latestVersion}`);
    console.log('Updating...');

    execSync('npm install -g @technicalheist/bu', { stdio: 'inherit' });
    console.log(`Updated to ${latestVersion}`);
  } catch (err) {
    throw new Error('Failed to check for updates: ' + err.message);
  }
}

module.exports = { update };
