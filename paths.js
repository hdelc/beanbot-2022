function _projectDir(userId, projectName) {
  return `./save/project/${userId}/${projectName}`
}

function _projectMeta(userId, projectName) {
  return `${_projectDir(userId, projectName)}/META.json`
}

function _projectFeedback(userId, projectName) {
  return `${_projectDir(userId, projectName)}/feedback.json`
}

function _listingFile(guildId) {
  return `./save/listing/${guildId}.json`
}

module.exports = {
  projectDir: _projectDir,
  projectMeta: _projectMeta,
  projectFeedback: _projectFeedback,
  listingFile: _listingFile
}