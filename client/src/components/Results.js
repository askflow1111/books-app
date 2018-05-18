import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateMenu,
  updateResults,
  areTwoArrSame,
  updateItemInfoModal,
  addFavItemToDB,
  deleteFavItemFromDB,
  udpateshownBooksLength
} from ".././actions/booksAppActions";
import FlipMove from 'react-flip-move';

class Results extends Component {

  shouldComponentUpdate(newProps, newState) {
    if (
      this.props.booksAppStore.fetched !== newProps.booksAppStore.fetched ||
      this.props.booksAppStore.booksApiData !== newProps.booksAppStore.booksApiData ||
      this.props.booksAppStore.updateResults !== newProps.booksAppStore.updateResults ||
      this.props.booksAppStore.userInput.listingType !== newProps.booksAppStore.userInput.listingType ||
      this.props.booksAppStore.userInput.maxResults !== newProps.booksAppStore.userInput.maxResults ||
      this.props.booksAppStore.userInput.sortBy !== newProps.booksAppStore.userInput.sortBy ||
      this.props.booksAppStore.userInput.searchBoxValue !== newProps.booksAppStore.userInput.searchBoxValue ||
      JSON.stringify(this.props.booksAppStore.favDataFromDB) !== JSON.stringify(newProps.booksAppStore.favDataFromDB) ||
      !this.props.dispatch(areTwoArrSame(this.props.booksAppStore.booksApiData, newProps.booksAppStore.booksApiData))
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleFavButton = item => {
    if (this.props.booksAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj")) || {};
      if (savedItemsObj[item.item_id] === undefined) {
        savedItemsObj[item.item_id] = item;
      } else if (savedItemsObj[item.item_id] !== undefined) {
        delete savedItemsObj[item.item_id];
      }
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      // this.forceUpdate();
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      if (this.props.booksAppStore.favDataFromDB[item.item_id] === undefined) {
        this.props.dispatch(addFavItemToDB(item, this.props.booksAppStore.userInfo.id));
      } else {
        this.props.dispatch(deleteFavItemFromDB(item.item_id, this.props.booksAppStore.userInfo.id));
      }
    }
  };

  filterResults = arr => {
    let newArr = [...arr];
    let searchBoxValue = this.props.booksAppStore.userInput.searchBoxValue;
    if (searchBoxValue !== null && searchBoxValue.trim() !== "") {
      if (this.props.booksAppStore.userInput.listingType === "title") {
        newArr = newArr.filter(e => e.title.toLowerCase().includes(searchBoxValue.toLowerCase()));
      } else {
        newArr = newArr.filter(element => element.authors.some(el => el.display_name.toLowerCase().includes(searchBoxValue.toLowerCase()))
        );
      }
    }
    if (this.props.booksAppStore.userInput.sortBy === "Price: lowest first") {
      newArr = newArr.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (this.props.booksAppStore.userInput.sortBy === "Price: highest first") {
      newArr = newArr.sort((a, b) => Number(b.price) - Number(a.price));
    }
    newArr = newArr.slice(0, this.props.booksAppStore.userInput.maxResults);
    this.props.dispatch(udpateshownBooksLength(newArr.length));
    return newArr;
  }

  handleMoreDetailsBttn = (item) => {
    this.props.dispatch(updateItemInfoModal(item, true));
  }

  renderList = () => {
    let savedItemsObj = (this.props.booksAppStore.hasFetchedFavDataFromDB && this.props.booksAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj"))) || {};
    let booksData = this.filterResults(this.props.booksAppStore.booksApiData);
    if (booksData.length > 0) {
      return booksData.map((item, index) => {
        return (
          <li key={item.item_id} className="list">
            <div className="image-container">
              <img src={item.image_url} alt="" />
            </div>
            <div className="content-container">
              <h4 className="name">{item.title}</h4>
              <p><span>Author(s): </span> {item.authors_name} </p>
              <p ><span>Publisher: </span> {item.publisher} </p>
              <p ><span>Price: </span>${item.price}</p>
              <button className="bttn more-details-bttn" onClick={() => this.handleMoreDetailsBttn(item)}>More Details</button>
              <div className={"fav-star " + ((savedItemsObj[item.item_id]) ? "fav-star-filled" : "")} onClick={() => this.handleFavButton(item)}></div>
            </div>
          </li>
        );
      });
    } else {
      return <h1>Nothing was found</h1>
    }
  };

  renderLoading = () => {
    return <h1 className="loading">Loading</h1>
  }

  render() {
    return (
      <div className="results">
        {(!this.props.booksAppStore.fetched) ? this.renderLoading() : (
          <ul>
            <FlipMove className="flip-move" >
              {this.renderList()}
            </FlipMove>
          </ul>)}
      </div>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default connect(mapStateToProps)(Results);
