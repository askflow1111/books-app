import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal } from ".././actions/booksAppActions";
import closeBttnImg from ".././images/closeBttnImg.png";


class ItemDetails extends Component {
  shouldComponentUpdate(newProps, newState) {
    if (
      this.props.booksAppStore.itemInfoForModal !== newProps.booksAppStore.itemInfoForModal ||
      this.props.booksAppStore.isSideBarOpen !== newProps.booksAppStore.isSideBarOpen ||
      this.props.booksAppStore.showItemInfoModal !== newProps.booksAppStore.showItemInfoModal
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeItemInfoModal = () => {
    this.props.dispatch(updateItemInfoModal(null, false));
  };

  render() {
    if (this.props.booksAppStore.showItemInfoModal) {
      let item = this.props.booksAppStore.itemInfoForModal;
      return (
        <div className="item-details-modal-main">
          <div className={"item-details-modal-container " + (!this.props.booksAppStore.isSideBarOpen ? 'sidebar-closed' : '')}>
            <img
              className="close-bttn-img"
              src={closeBttnImg}
              alt="Close Button"
              onClick={this.closeItemInfoModal}
            />
            <ul>
              <li key={item.id} className="list">
                <div className="image-container">
                  <img src={item.image_url} alt="" />
                </div>
                <div className="content-container">
                  <h4 className="name">{item.title}</h4>
                  <p><span>Author(s): </span>{item.authors_name} </p>
                  <p><span>Publisher: </span>{item.publisher}</p>
                  <p><span>Price: </span>${item.price}</p>
                  <p>
                    <span>Description: </span >
                    <p dangerouslySetInnerHTML={{ __html: item.description }} />
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps({ booksAppStore }) {
  return { booksAppStore };
}

export default connect(mapStateToProps)(ItemDetails);
