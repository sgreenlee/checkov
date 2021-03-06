var Store = require("flux/utils").Store;
var AppDispatcher = require("../dispatcher/dispatcher");
var ProjectConstants = require("../constants/projectConstants");
var SessionConstants = require("../constants/sessionConstants");

var _projects = {};
var _errors = [];
var _currentTeam = null;

var _lastReceivedProjectId = null;

function _receiveAllProjects(team_id, projects) {
  _currentTeam =  team_id;
  _projects = {};
  projects.forEach( function (project){
    _projects[project.id] = project;
  });
  _errors = [];
}

function _receiveProject(project) {
  _lastReceivedProjectId = project.id;
  _projects[project.id] = project;
  _errors = [];
}

function _clear() {
  _projects = {};
  _currentTeam = null;
  _errors = [];
  _lastReceivedProjectId = null;
}

function _setErrors(errors) {
  _errors = errors;
}

var ProjectStore = new Store(AppDispatcher);

ProjectStore.all = function() {
  return Object.keys(_projects).map( function (projectId){ return _projects[projectId]; });
};

ProjectStore.find = function(id) {
  return _projects[id];
};

ProjectStore.findByProject = function (projectId) {
  return ProjectStore.all.filter( function (project) { return project.project_id === projectId; });
};

ProjectStore.getCurrentTeam = function () {
  return _currentTeam;
};

ProjectStore.getLastReceivedProject = function () {
  return _lastReceivedProjectId;
};

ProjectStore.getErrors = function () {
  return _errors;
};

ProjectStore.__onDispatch = function (payload) {
  switch (payload.actionType) {

    case (SessionConstants.LOGOUT):
      _clear();
      break;

    case ProjectConstants.RECEIVE_ALL_PROJECTS:
      _lastReceivedProjectId = null;
      _receiveAllProjects(payload.teamId, payload.projects);
      ProjectStore.__emitChange();
      break;

    case ProjectConstants.RECEIVE_PROJECT_ERRORS:
      _lastReceivedProjectId = null;
      _setErrors(payload.errors);
      ProjectStore.__emitChange();
      break;

    case ProjectConstants.RECEIVE_PROJECT:
      // ignore projects that belong to currently loaded team
      if (payload.project.team_id === _currentTeam) {
        _receiveProject(payload.project);
        ProjectStore.__emitChange();
      }
      break;
  }
};

module.exports = ProjectStore;
