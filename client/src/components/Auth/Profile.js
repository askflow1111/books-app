import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeUserInfoId,
  changeUserInfoUsername,
  changeUserInfoEmail
} from "../../actions/booksAppActions";

class Profile extends Component {
  shouldComponentUpdate(newProps, newState) {
    return false;
  }

  componentDidMount() {
    if (this.props.booksAppStore.userInfo.id === null) {
      this.props.history.push(`/login`);
    }
  }

  render() {
    return (
      <div className="user-form-container">
        <div className="user-form profile">
          <h3>My Profile</h3>
          <table className="table table-user-information">
            <tbody>
              <tr><td>User Name:</td><td>{this.props.booksAppStore.userInfo.username}</td>
              </tr>
              <tr>
                <td>Email:</td><td><a href={"mailto:" + this.props.booksAppStore.userInfo.email}>{this.props.booksAppStore.userInfo.email}</a></td>
              </tr>
            </tbody>
          </table>
          <footer>Your Profile Information</footer>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default withRouter(connect(mapStateToProps)(Profile));
