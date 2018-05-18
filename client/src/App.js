import React, { Component } from "react";
import Main from "./components/Main";
import {
  withRouter, Route, Switch, browserHistory, Redirect, BrowserRouter as Router,
} from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchBooksApiDataFromBackend,
  changeUserInputSearchBoxValue,
  changeUserInputNameOrFoodPairValue,
  changeUserInputSortBy,
  changeUserInputMaxResults,
  changeUserInfoId,
  changeUserInfoUsername,
  changeUserInfoEmail,
  fetchFavDataFromDatabase,
  transferDataFromLocalStorageToDB
} from "./actions/booksAppActions";

class App extends Component {
  constructor(props) {
    super(props);
  }

  removeStringFromNull = obj => {
    for (let key in obj) {
      if (obj[key] === "null") {
        obj[key] = null;
      }
    }
  }

  changeInputValues = match => {
    this.removeStringFromNull(match.params)
    this.props.dispatch(changeUserInputNameOrFoodPairValue(match.params.listingType))
    this.props.dispatch(changeUserInputSearchBoxValue(match.params.searchBoxValue));
    this.props.dispatch(changeUserInputSortBy(match.params.sortBy));
    this.props.dispatch(changeUserInputMaxResults(match.params.maxResults));
    this.props.dispatch(changeUserInputMaxResults(match.params.maxResults));
  }

  fetch = match => {
    this.props.dispatch(fetchBooksApiDataFromBackend(match.params.searchBoxValue, match.params.listingType, match.params.maxResults, match.params.sortBy));
  };

  updateUserData = () => {
    fetch('/api/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.userInfo && responseJson.userInfo.id !== null) {
          this.props.dispatch(changeUserInfoId(responseJson.userInfo.id));
          this.props.dispatch(changeUserInfoEmail(responseJson.userInfo.email));
          this.props.dispatch(changeUserInfoUsername(responseJson.userInfo.username));
          (JSON.parse(localStorage.getItem("savedItemsObj")) !== undefined) && (this.props.dispatch(transferDataFromLocalStorageToDB(responseJson.userInfo.id)));
          this.props.dispatch(fetchFavDataFromDatabase(responseJson.userInfo.id));
        } else {
          this.props.dispatch(changeUserInfoId(null));
          this.props.dispatch(changeUserInfoEmail(null));
          this.props.dispatch(changeUserInfoUsername(null));
        }
      })
  }

  shouldComponentUpdate(newProps, newState) {
    return false;
  }

  componentDidMount() {
    this.updateUserData();
  }

  render() {
    return (
      <Router >
        <Switch>
          <Route
            path="/Search=:searchBoxValue&listingType=:listingType&sortBy=:sortBy&maxResults=:maxResults"
            render={({ match }) => {
              if (!this.props.booksAppStore.comingFromInput && this.props.booksAppStore.shouldFetch) {
                this.changeInputValues(match);
                this.fetch(match);
              };
              return <Main />;
            }}
          />
          <Route
            exact path="/"
            render={({ match }) => {
              this.fetch(match);
              return <Main />;
            }}
          />

          <Route
            exact path="/register"
            render={({ match }) => {
              return <Main />;
            }}
          />
          <Route
            exact path="/profile"
            render={({ match }) =>
              ((this.props.booksAppStore.userInfo.id === null) ? <Redirect to='/login' /> : <Main />)
            }
          />

          <Route
            exact path="/login"
            render={({ match }) => {
              return ((this.props.booksAppStore.userInfo.id !== null) ? <Redirect to='/profile' /> : <Main />)
            }
            }
          />

          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default withRouter(connect(mapStateToProps)(App));
