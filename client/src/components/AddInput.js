import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import Dropdown from 'react-dropdown'

import {
  fetchBooksApiDataFromBackend,
  changeUserInputSearchBoxValue,
  changeUserInputNameOrFoodPairValue,
  changeUserInputSortBy,
  changeShouldFetch,
  changeComingFromInput,
  changeUserInputMaxResults,
  changeUrlToUserInput,
} from "../actions/booksAppActions";

class AddInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: null,
    };
  }

  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.booksAppStore;
    let newData = newProps.booksAppStore;
    if (
      oldData.userInput.listingType !== newData.userInput.listingType ||
      oldData.userInput.searchBoxValue !== newData.userInput.searchBoxValue ||
      oldData.userInput.maxResults !== newData.userInput.maxResults ||
      oldData.userInput.sortBy !== newData.userInput.sortBy ||
      this.state.focused !== newState.focused
    ) {
      return true;
    } else {
      return false;
    }
  }

  trimSpaces = value => {
    if (value.trim() === "") {
      return false;
    } else {
      value = value.trim();
      return true;
    }
  };

  shouldSubmitForm = (prevProps) => {
    let oldUserInput = this.props.booksAppStore.userInput;
    let newUserInput = prevProps.booksAppStore.userInput;
    if (
      oldUserInput.listingType !== newUserInput.listingType ||
      oldUserInput.searchBoxValue !== newUserInput.searchBoxValue ||
      oldUserInput.sortBy !== newUserInput.sortBy
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    this.updateURL();
    if (this.shouldSubmitForm(prevProps)) this.submitForm();
  }

  submitForm = () => {
    this.props.dispatch(changeShouldFetch(true));
    this.props.dispatch(changeComingFromInput(true));
    this.props.dispatch(fetchBooksApiDataFromBackend(this.refs.searchBox.value, this.props.booksAppStore.userInput.listingType, this.props.booksAppStore.userInput.maxResults, this.props.booksAppStore.userInput.sortBy));

  };

  updateURL = () => {
    if (this.trimSpaces(this.props.booksAppStore.userInput.searchBoxValue)) {
      this.props.dispatch(changeUrlToUserInput(this.props.booksAppStore.userInput.searchBoxValue, this.props.booksAppStore.userInput.listingType, this.props.booksAppStore.userInput.sortBy, this.props.booksAppStore.userInput.maxResults, this.props.history))
    };
  };

  handleRadioOptionsChange = (e) => {
    this.props.dispatch(changeUserInputNameOrFoodPairValue(e.target.value))

  }

  handleSearchBoxValue = e => {
    this.props.dispatch(changeUserInputSearchBoxValue(e.target.value));
  }

  render() {
    const horizontalLabels = {
      0: 'Low',
      50: 'Medium',
      100: 'High'
    }

    return (
      <div className="add-input">
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          this.submitForm();
        }}>
          <div >
            <h3 className="heading"><span> Search</span></h3>
            <input
              type="text"
              id="thing"
              name="searchBox"
              required
              placeholder="Hi!"
              value={this.props.booksAppStore.userInput.searchBoxValue}
              onChange={this.handleSearchBoxValue}
              ref="searchBox"
              className="search-box-input"
            />
            <div className="radio-bttns-group" onChange={this.handleRadioOptionsChange}>
              <div><input type="radio" value="title" checked={this.props.booksAppStore.userInput.listingType === "title"} /> Search Books By Title</div>
              <br />
              <div><input type="radio" value="author" checked={this.props.booksAppStore.userInput.listingType === "author"} /> Search Books By Author</div>
            </div>
          </div>
          <div className='slider custom-labels'>
            <h3 className="heading"><span>   Max Results</span></h3>
            <Slider
              min={0}
              max={100}
              value={Number(this.props.booksAppStore.userInput.maxResults)}
              labels={horizontalLabels}
              onChange={(e) => this.props.dispatch(changeUserInputMaxResults(e))}
              onChangeComplete={this.submitForm}
            />
            <hr />
          </div>
          <button className="bttn search-form-bttn">Search</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default withRouter(connect(mapStateToProps)(AddInput));
