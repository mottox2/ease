import { initStore, Store } from 'react-waterfall'

const store: Store = {
  initialState: {
    categories: []
  },
  actions: {
    setCategories: ({}, newCategories: Array<any>) => {
      return {
        categories: newCategories
      }
    }
  }
}

export const { Provider, Consumer, actions, getState } = initStore(store)
