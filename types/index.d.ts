declare module 'linkify-urls' {
  type LinkifyUrls = (text: string, options: Object) => string
  var linkifyUrls: LinkifyUrls
  export default linkifyUrls
}

declare module 'react-waterfall' {
  interface State {}

  interface Actions {}

  type InitStore = (
    store: Store,
    middleware?: any
  ) => {
    Provider: React.ComponentClass
    Consumer: React.ComponentClass
    actions: Actions
    getState: () => State
  }
  export var initStore: InitStore

  export type Store = {
    initialState: State
    actions: Actions
  }
}
