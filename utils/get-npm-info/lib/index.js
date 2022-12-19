'use strict';
const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');
function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl =urlJoin(registryUrl, npmName);

  return axios.get(npmInfoUrl).then(response => {
    if (response.status === 200) {
      return response.data;
    }

    return null;
  }).catch(err => {
    return Promise.reject(err);
  });
}

function getDefaultRegistry(isOriginal=false) {
  return isOriginal?'https://registry.npmjs.org':'https://registry.npm.taobao.org';
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  }

  return [];
}

function getSemverVersions(baseVersion, versions) {
  versions.unshift('0.0.4');

  // 筛选出大于现在版本的线上版本
  return versions
    .filter(version =>
    semver.satisfies( version, `>=${baseVersion}` ))
    .sort((a, b)=>semver.gt(b, a));
}

async function getNpmSemverVersions(baseVersion, npmName, registry ) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersions,
};
