import { initStore, Store } from 'react-waterfall'
import { Task } from './DataBase'

interface State {
  categories: Array<string>
  currentCategory: string
}

interface Actions {
  setCategories: (newCategories: Array<any>) => State
  setCategory: (category: string) => State
  loadCategories: () => State
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
    },
    loadCategories: async ({}) => {
      const categories = await Task.categories()
      return { categories }
    }
  }
}

export const { Provider, Consumer, actions, getState } = initStore(store)
