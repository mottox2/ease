import { initStore, Store } from 'react-waterfall'

interface State {
  categories: Array<string>
  currentCategory: string
}

interface Actions {
  setCategories: (newCategories: Array<any>) => State
  setCategory: (category: string) => State
}

const store: Store<State, Actions> = {
  initialState: {
    categories: [],
    currentCategory: ''
  },
  actions: {
    setCategories: ({}, newCategories: Array<any>) => {
      return {
        categories: newCategories
      }
    },
    setCategory: ({}, category) => {
      return {
        currentCategory: category
      }
    }
  }
}

export const { Provider, Consumer, actions, getState } = initStore(store)
