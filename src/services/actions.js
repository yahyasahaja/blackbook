//TYPES
export const UPDATE_SELECTED = 'updateSelected'
export const ONLINE = 'onilne'
export const OFFLINE = 'offline'
export const SHOW_SNACKBAR = 'showSnackbar'
export const HIDE_SNACKBAR = 'hideSnackbar'
export const SHOW_POPUP = 'showPopup'
export const HIDE_POPUP = 'hidePopup'
export const SET_CATEGORIES = 'setCategories'
export const ADD_FAVORITE = 'addFavorite'
export const REMOVE_FAVORITE = 'removeFavorite'
export const POPUP_STACK_PUSH = 'popupStackPush'
export const POPUP_STACK_POP = 'popupStackPop'
export const SET_POPUP_STACK = 'setStackPopup'
export const RESET_POPUP_STACK = 'resetPopupStack'

//ACTIONS
export const updateSelected = (id, selected) => ({ type: UPDATE_SELECTED, id, selected })
export const online = () => ({ type: ONLINE })
export const offline = () => ({ type: OFFLINE })
export const showSnackbar = (label, type, action) => ({
  type: SHOW_SNACKBAR,
  payload: {
    label, type, action
  }
})
export const showPopup = () => ({ type: SHOW_POPUP })
export const hidePopup = () => ({ type: HIDE_POPUP })
export const hideSnackbar = () => ({ type: HIDE_SNACKBAR })
export const setCategories = categories => ({ type: SET_CATEGORIES, categories })
export const addFavorite = favorite => ({ type: ADD_FAVORITE, favorite })
export const removeFavorite = id => ({ type: REMOVE_FAVORITE, id })
export const popupStackPush = () => ({ type: POPUP_STACK_PUSH })
export const popupStackPop = () => ({ type: POPUP_STACK_POP })
export const setPopupStack = index => ({ type: SET_POPUP_STACK, index })
export const resetPopupStack = () => ({ type: RESET_POPUP_STACK })

export default {
  updateSelected,
  online,
  offline,
  showSnackbar,
  showPopup,
  hidePopup,
  hideSnackbar,
  setCategories,
  addFavorite,
  removeFavorite,
  popupStackPop,
  popupStackPush,
  setPopupStack,
  resetPopupStack,
}