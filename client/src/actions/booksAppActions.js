export function fetchBooksApiDataFromBackend(searchBoxValue, listingType, maxResults, sortBy) {
  return function (dispatch) {
    fetch('/booksApi', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    })
      .then(res => res.json())
      .then((responseJson) => {
        let data = fixBooksApiData(responseJson);
        dispatch({
          type: "FETCH_BOOKSAPI_FULFILLED",
          payload: {
            booksApiData: data,
          },
        });
      })
      .catch(err => {
        dispatch({ type: "FETCH_BOOKSAPI_REJECTED", payload: err });
      });
  };
}

function fixBooksApiData(items) {
  items.forEach(item => {
    item.item_id = item._id.$oid
    item.image_url = ((item.image) && (item.image.includes("http") ? item.image : `http://${item.image}`)) || ("https://www.jainsusa.com/images/store/landscape/not-available.jpg")
    item.authors_name = item.authors.map((e) => e.display_name).join(', ');
  });
  return items;
}

export function transferDataFromLocalStorageToDB(userId) {
  return function (dispatch) {
    let favLocalStorageItems = JSON.parse(localStorage.getItem("savedItemsObj"));
    for (let key in favLocalStorageItems) {
      dispatch(addFavItemToDB(favLocalStorageItems[key], userId));
    }
    localStorage.setItem("savedItemsObj", null);
  };
}

export function fetchFavDataFromDatabase(userId) {
  return function (dispatch) {
    fetch('/fav/show', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        dispatch({ type: "FETCH_FAV_DATA_FROM_DATABASE_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function change_hasFetchedFavDataFromDB(data) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_hasFetchedFavDataFromDB", payload: data });
  };
}

export function addFavItemToDB(item, userId) {
  return function (dispatch) {
    fetch('/fav/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        item_id: item.item_id,
        user_id: userId,
        title: item.title,
        image_url: item.image_url,
        price: item.price,
        description: item.description,
        publisher: item.publisher,
        authors_name: item.authors_name,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "ADD_FAV_ITEM_TO_DB_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function deleteFavItemFromDB(item_id, userId) {
  return function (dispatch) {
    fetch('/fav/destroy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        item_id: item_id,
        user_id: userId,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "DELETE_FAV_ITEM_FROM_DB_FULFILLED", payload: item_id });
      })
  };
}

export function areTwoArrSame(arrOne, arrTwo) {
  return function () {
    if (arrOne.length !== arrTwo.length) {
      return false;
    }
    for (let i = 0; i < arrOne.length; i++) {
      if (JSON.stringify(arrOne[i]) !== JSON.stringify(arrTwo[i]))
        return false;
    }
    return true;
  };
}

export function changeUrlToUserInput(searchBoxValue, listingType, sortBy, maxResults, history) {
  return function (dispatch) {
    history.push(`/Search=${searchBoxValue}&listingType=${listingType}&sortBy=${sortBy}&maxResults=${maxResults}`);
  };
}

export function changeUserInputSortBy(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SortBy", payload: value });
  };
}

export function changeUserInputNameOrFoodPairValue(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_NameOrFoodPairValue", payload: value });
  };
}

export function changeUserInputSearchBoxValue(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SearchBoxValue", payload: value });
  };
}

export function changeUserInputMaxResults(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_MaxResults", payload: value });
  };
}

export function changeUserInfoId(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_ID", payload: value });
  };
}

export function changeUserInfoUsername(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_USERNAME", payload: value });
  };
}

export function changeUserInfoEmail(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_EMAIL", payload: value });
  };
}

export function playAuthFailedAnimation(ele, animation) {
  return function () {
    ele.classList.add(animation);
    setTimeout(() => {
      ele.classList.remove(animation);
    }, 1000);
  };
}

export function changeShouldFetch(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ShouldFetch", payload: value });
  };
}

export function changeComingFromInput(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ComingFromInput", payload: value });
  };
}

export function updateMenu() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_MENU", payload: null });
  };
}

export function updateResults() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_RESULTS", payload: null });
  };
}

export function reloadWebsite() {
  return function (dispatch) {
    dispatch({ type: "RESET_THE_SEARCH_DATA", payload: null });
  };
}

export function emptyFavDataFromDB() {
  return function (dispatch) {
    dispatch({ type: "EMPTY_FAV_DATA_FROM_DB", payload: null });
  };
}

export function updateSideBarState(value) {
  return function (dispatch) {
    dispatch({ type: "UPDATE_SIDEBAR_STATE", payload: value });
  };
}

export function updateItemInfoModal(itemInfoForModal, showItemInfoModal) {
  return function (dispatch) {
    dispatch({
      type: "ZOOM_IMAGE",
      payload: {
        itemInfoForModal,
        showItemInfoModal,
      },
    });
  };
}

export function udpateshownBooksLength(shownBooksLength) {
  return function (dispatch) {
    dispatch({
      type: "UPDATE_SHOWN_BOOKS_LENGTH",
      payload: {
        shownBooksLength,
      },
    });
  };
}