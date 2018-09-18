//MODULES
import React, { Component } from 'react'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/country-selection.scss'

//STORAGE
import { country } from '../services/stores'

//COMPONENT
@observer
export default class CountrySelection extends Component {
  handleChange = nextCountry => {
    country.setCountry(nextCountry)
  }

  render() {
    return (
      <div 
        className={styles.container} 
        style={{display: country.isCountryPageOpened ? 'flex' : 'none'}} 
        onClick={country.closeCountryPage}
      >
        <div className={styles.close}>
          <span>&times;</span>
        </div>
        <span className={styles.title} >Select Country</span>

        <div className={styles.selection} onClick={e => e.stopPropagation()} >
          <RadioGroup name='comic' value={country.currentCountry} onChange={this.handleChange}>
            <RadioButton label='Taiwan' value='twn'/>
            <RadioButton label='Hongkong' value='hkg'/>
          </RadioGroup>
        </div>
      </div>
    )
  }
}
