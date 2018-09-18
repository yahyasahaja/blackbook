//MODULES
import { observable, computed, action } from 'mobx'

//OTHER_STORAGE
import tokens from './Tokens'

//CONFIG
import { SELECTED_COUNTRY_STORAGE_URI } from '../../config'

//STORE
class Country {
  @observable isCountryPageOpened = false

  @action
  openCountryPage = () => {
    this.isCountryPageOpened = true
  } 

  @action
  closeCountryPage = () => {
    this.isCountryPageOpened = false
  } 

  @computed
  get countryBasedOnToken() {
    if (
      tokens.rawApiToken !== null ||
      tokens.rawApiToken != 'undefined' || 
      tokens.rawApiToken != 'null'
    ) {
      if (tokens.rawApiToken.value.indexOf('SESSTWN') != -1) return 'twn'
      return 'hkg'
    }
  }

  @observable currentCountry = (
    !localStorage.getItem(SELECTED_COUNTRY_STORAGE_URI)
      ? this.countryBasedOnToken
      : localStorage.getItem(SELECTED_COUNTRY_STORAGE_URI)
  )

  @action
  setCountry(country) {
    this.currentCountry = country
    localStorage.setItem(SELECTED_COUNTRY_STORAGE_URI, country)
    window.location.reload()
  }
}

export default new Country()