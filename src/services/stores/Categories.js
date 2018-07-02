//MODULES
import { observable } from 'mobx'
import _ from 'lodash'

//STORE
class Categories {
  @observable data = {}

  getConverted(key) {
    if (!this.data) return [{ value: 'all', label: 'All Categories' }]

    let convertedData = key ? this.data[key] : this.data
    convertedData = _.map(convertedData, (val, name) => {
      if (key) name = val
      return ({ label: name, value: name })
    })
    convertedData.unshift({ value: 'all', label: `All ${key ? key : 'Categories'}` })
    return convertedData
  }

  setCategories(raw) {
    let allCategories = raw
    let categories = {}
    for (let i in allCategories) {
      categories[allCategories[i].name] = []
      for (let j in allCategories[i].children)
        categories[allCategories[i].name].push(allCategories[i].children[j].name)
    }

    this.data = categories
  }
}

export default new Categories()