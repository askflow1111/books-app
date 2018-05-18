import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal, updateMenu, updateResults, updateSideBarState, deleteFavItemFromDB } from ".././actions/booksAppActions";
import zoomBttnImg from ".././images/zoomBttnImg.png";
import delBttnImg from ".././images/delBttnImg.png";
import { scaleRotate as Menu } from "react-burger-menu";

class BurgerMenu extends Component {
  shouldComponentUpdate(newProps, newState) {
    return ((this.props.booksAppStore.updateMenu !== newProps.booksAppStore.updateMenu) || (JSON.stringify(this.props.booksAppStore.favDataFromDB) !== JSON.stringify(newProps.booksAppStore.favDataFromDB)));
  }

  deleteItem = id => {
    if (this.props.booksAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj"));
      delete savedItemsObj[id];
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      this.props.dispatch(deleteFavItemFromDB(id, this.props.booksAppStore.userInfo.id));
    }

  };

  openItem = item => {
    this.props.dispatch(updateItemInfoModal(item, true));
  };

  handleMenuStateChange = e => {
    this.props.dispatch(updateSideBarState(e.isOpen));
  }

  renderList = () => {
    let savedItemsObj = (this.props.booksAppStore.hasFetchedFavDataFromDB && this.props.booksAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj")));
    if (savedItemsObj !== null) {
      let listArr = [];
      for (let key in savedItemsObj) {
        listArr.push(
          <li key={savedItemsObj[key].item_id}>
            <div className="img-container">
              <img src={savedItemsObj[key].image_url} alt="" />
            </div>
            <h4 className="name">{savedItemsObj[key].title}</h4>
            <div className="options">
              <img
                onClick={e => this.openItem(savedItemsObj[key])}
                className="open-img-bttn"
                src={zoomBttnImg}
                alt="Zoom Button"
              />
              <img
                onClick={e => this.deleteItem(savedItemsObj[key].item_id)}
                className="delete-img-bttn"
                src={delBttnImg}
                alt="Delete Button"
              />
            </div>
          </li>
        )
      }
      return listArr;
    }
  };

  render() {
    return (
      <Menu
        onStateChange={this.handleMenuStateChange}
        className="sidebar"
        width={"15%"}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
      >
        <ul>{this.renderList()}</ul>
      </Menu>
    );
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default connect(mapStateToProps)(BurgerMenu);
