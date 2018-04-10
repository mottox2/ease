declare module 'linkify-urls' {
  type LinkifyUrls = (text: string, options: Object) => string
  var linkifyUrls: LinkifyUrls
  export default linkifyUrls
}

declare module 'react-waterfall' {
  type States<S> = S
  type Actions<A> = A

  type Store<S, A> = {
    initialState: States<S>
    actions: StoreActions<S, A>
  }

  type StoreActions<S, A> = { [actionName in keyof A]: (state: S, ...args: any[]) => any }

  export function initStore<S, A>(
    store: Store<S, A>,
    middleware?: any
  ): {
    Provider: React.ComponentClass
    Consumer: React.ComponentClass
    actions: Actions<A>
    getState: () => States<S>
  }
}
