//MODULES
import { combineReducers } from 'redux'

//ACTIONS
import {
  UPDATE_SELECTED,
  OFFLINE,
  ONLINE,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  SHOW_POPUP,
  HIDE_POPUP,
  SET_CATEGORIES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  SET_POPUP_STACK,
  POPUP_STACK_POP,
  POPUP_STACK_PUSH,
  RESET_POPUP_STACK,
} from './actions'

//REDUCER
const selectedReducer = (state = {}, action) => {
  if (action.type === UPDATE_SELECTED) {
    return { ...state, [action.id]: action.selected }
  } else {
    return state
  }
}

const onlineReducer = (state = true, action) => {
  if (action.type === OFFLINE) return false
  else if (action.type === ONLINE) return true
  return state
}

let INITIAL_SNACKBAR = {
  active: false,
  action: 'Dismiss',
  label: 'Snackbar action cancel',
  type: 'cancel',
}

const snackbarReducer = (state = INITIAL_SNACKBAR, { type, payload }) => {
  if (type == SHOW_SNACKBAR) {
    return {
      active: true,
      action: payload.action || state.action,
      label: payload.label || state.label,
      type: payload.type || state.type,
    }
  }
  if (type == HIDE_SNACKBAR) {
    return {
      ...state,
      active: false,
    }
  }
  return state
}

const isPopupReducer = (state = false, { type }) => {
  if (type === SHOW_POPUP) return true
  if (type === HIDE_POPUP) return false
  return state
}

const categoriesReducer = (state = null, { type, categories }) => {
  if (type === SET_CATEGORIES) return categories
  return state
}

const favoritesReducer = (state = [], { type, favorite, id }) => {
  if (type === ADD_FAVORITE) {
    for (let i in state) if (state[i].id === favorite.id) return state
    return [...state, favorite]
  } else if (type === REMOVE_FAVORITE) {
    let newFavorite = [...state]
    // let indexToRemove

    for (let i in newFavorite) if (newFavorite[i].id === id) {
      newFavorite.splice(i, 1)
      return newFavorite
    }

    return state
  }
  return state
}

const popupStackReducer = (state = 0, { type, index }) => {
  if (type === POPUP_STACK_PUSH) return state++
  if (type === POPUP_STACK_POP) return state <= 0 ? 0 : state--
  if (type === RESET_POPUP_STACK) return 0
  if (type === SET_POPUP_STACK) return index
  return state
}

//COMBINED
export default combineReducers({
  selected: selectedReducer,
  isOnline: onlineReducer,
  snackbar: snackbarReducer,
  isPopup: isPopupReducer,
  categories: categoriesReducer,
  favorites: favoritesReducer,
  popupStack: popupStackReducer,
})

//INI ADALAH STATE