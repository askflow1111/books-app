import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom";

import Dropdown from 'react-dropdown'

import { changeUserInputSortBy, changeUrlToUserInput } from "../actions/booksAppActions";


class SortBy extends Component {
  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.booksAppStore;
    let newData = newProps.booksAppStore;
    if (
      oldData.userInput.sortBy !== newData.userInput.sortBy
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleSortByChange = (e) => {
    this.props.dispatch(changeUserInputSortBy(e.value))
    if (this.props.booksAppStore.userInput.searchBoxValue !== "") {
      this.props.dispatch(changeUrlToUserInput(this.props.booksAppStore.userInput.searchBoxValue, this.props.booksAppStore.userInput.listingType, this.props.booksAppStore.userInput.sortBy, this.props.booksAppStore.userInput.maxResults, this.props.history))
    }
  }

  render() {
    return (
      <div className="sortby">
        <Dropdown
          options={['Best Match', 'Price: lowest first', 'Price: highest first']}
          onChange={this.handleSortByChange}
          value={this.props.booksAppStore.userInput.sortBy}
          placeholder="Select an option"
          ref="sortBy"
        />
      </div>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default withRouter(connect(mapStateToProps)(SortBy));
