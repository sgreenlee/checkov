var React = require("react");
var ProjectActions = require("../actions/projectActions");
var ProjectStore = require("../stores/projectStore");

var TeamProjectList = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {newTeamName: "", errors: []};
  },

  componentDidMount: function () {
    this.listener = ProjectStore.addListener(this.onResponse);
  },


  onResponse: function () {
    var errors = ProjectStore.getErrors();
    if (errors.length != 0) {
      this.setState({ errors: errors });
    } else {
      this.closeModal();
    }
  },

  openModal: function () {
    $(".project-modal-group").addClass("open");
  },

  closeModal: function (e) {
    $(".project-modal-group").removeClass("open");
  },

  onFormInput: function (e) {
    this.setState({newTeamName: e.target.value });
  },

  onSubmit: function (e) {
    e.preventDefault();
    ProjectActions.createProject({title: this.state.newTeamName, team_id: this.props.teamId });
    this.setState({ newTeamName: "" });
  },

  render: function() {
    var teamId = this.props.teamId;
    return (
      <div className="project-list-component">
        <div className="project-list">
          <div className="header">
            <h6>Projects</h6>
            <a onClick={this.openModal} className="plus-icon" />
          </div>
          <ul>
            { this.props.projects && this.props.projects.map(function (project) {
              return (
                <li key={project.id}>
                  <a href={"#/teams/" + teamId + "/" + project.id + "/list" }>{project.title}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="project-modal-group modal-overlay" onClick={this.closeModal} />
        <div className="project-modal-group modal">
          <h4>New Project</h4>
          <a className="x-icon close-modal" onClick={this.closeModal} />
          <form onSubmit={this.onSubmit} className="clearfix">
            <ul className="error-messages">
              {
                (this.state.errors).map(function (error) {
                  return <li>{error}</li>;
                })
              }
            </ul>
            <label htmlFor="project-name">Project Name</label>
            <input value={this.state.newTeamName} onChange={this.onFormInput} type="text" id="project-name" />
            <input type="submit" value="Create Project" />
          </form>
        </div>
      </div>

    );
  }

});

module.exports = TeamProjectList;
