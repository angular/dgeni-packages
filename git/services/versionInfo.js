'use strict';

const child = require('child_process');
const semver = require('semver');

const GIT = process.env.GIT_BIN || 'git';

let currentVersion, currentPackage, previousVersions;
/**
* Check the version is satisfactory.
* @return {Boolean} Return true if the version is satisfactory.
*/
function satisfiesVersion(version) {
  if (currentPackage.branchVersion !== undefined) {
    return semver.satisfies(version, currentPackage.branchVersion);
  } else if (currentPackage.version !== undefined) {
    return semver.satisfies(version, '^' + currentPackage.version);
  } else {
    return true;
  }
}

/**
 * Extract the code name from the tagged commit's message - it should contain the text of the form:
 * "codename(some-code-name)"
 * @param  {String} tagName Name of the tag to look in for the codename
 * @return {String}         The codename if found, otherwise null/undefined
 */
function getCodeName(tagName) {
  const gitCatOutput = child.spawnSync(GIT, ['cat-file', '-p ' + tagName], {encoding:'utf8'}).stdout;
  const match = gitCatOutput.match(/^.*codename.*$/mg);
  const tagMessage = match && match[0];
  return tagMessage && tagMessage.match(/codename\((.*)\)/)[1];
}

/**
 * Get the current commit SHA
 * @return {String} The commit SHA
 */
function getCommitSHA() {
  return child.spawnSync(GIT, ['rev-parse', 'HEAD'], {encoding:'utf8'}).stdout.replace('\n', '');
}

/**
 * Compute a build segment for the version, from the Jenkins build number and current commit SHA
 * @return {String} The build segment of the version
 */
function getBuild() {
  const hash = child.spawnSync(GIT, ['rev-parse', '--short', 'HEAD'], {encoding:'utf8'}).stdout.replace('\n', '');
  return 'sha.' + hash;
}

/**
 * If the current commit is tagged as a version get that version
 * @return {SemVer} The version or null
 */
function getTaggedVersion() {
  const gitTagResult = child.spawnSync(GIT, ['describe', '--exact-match'], {encoding:'utf8'});

  if (gitTagResult.status === 0) {
    const tag = gitTagResult.stdout.trim();
    const version = semver.parse(tag);

    if (version && satisfiesVersion(version)) {
      version.codeName = getCodeName(tag);
      version.full = version.version;

      if (currentPackage.branchPattern !== undefined) {
        version.branch = 'v' + currentPackage.branchPattern.replace('*', 'x');
      }
      return version;
    }
  }

  return null;
}

/**
 * Get the unstable snapshot version
 * @return {SemVer} The snapshot version
 */
function getSnapshotVersion() {
  let version;
  for(let i = previousVersions.length - 1; i >= 0; i--) {
    if (satisfiesVersion(previousVersions[i])) {
      version = previousVersions[i];
      break;
    }
  }

  if (!version) {
    // a snapshot version before the first tag on the branch
    if (currentPackage.version !== undefined) {
      version = semver(currentPackage.version);
    } else if (currentPackage.branchPattern !== undefined)  {
      version = semver(currentPackage.branchPattern.replace('*','0-beta.1'));
    } else {
      version = semver('0.1.0-beta.1');
    }

  }

  // We need to clone to ensure that we are not modifying another version
  version = semver(version.raw);

  const jenkinsBuild = process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER;
  if (!version.prerelease || !version.prerelease.length) {
    // last release was a non beta release. Increment the patch level to
    // indicate the next release that we will be doing.
    // E.g. last release was 1.3.0, then the snapshot will be
    // 1.3.1-build.1, which is lesser than 1.3.1 according to semver!

    // If the last release was a beta release we don't update the
    // beta number by purpose, as otherwise the semver comparison
    // does not work any more when the next beta is released.
    // E.g. don't generate 1.3.0-beta.2.build.1
    // as this is bigger than 1.3.0-beta.2 according to semver
    version.patch++;
  }
  version.prerelease = jenkinsBuild ? ['build', jenkinsBuild] : ['local'];
  version.build = getBuild();
  version.codeName = 'snapshot';
  version.isSnapshot = true;
  version.format();
  version.full = version.version + '+' + version.build;
  version.branch = 'master';

  return version;
}


module.exports = function versionInfo(getPreviousVersions, packageInfo, gitRepoInfo) {
  currentPackage = packageInfo;
  previousVersions = getPreviousVersions();
  currentVersion = getTaggedVersion() || getSnapshotVersion();
  currentVersion.commitSHA = getCommitSHA();

  return {
    currentPackage: currentPackage,
    gitRepoInfo: gitRepoInfo,
    previousVersions: previousVersions,
    currentVersion: currentVersion
  };
};
