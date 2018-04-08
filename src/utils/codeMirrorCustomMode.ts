import { defineMode } from 'codemirror'

defineMode('custom', () => {
  return {
    token: (stream: any, state: any) => {
      if (stream.match(/#\w+/)) {
        return 'keyword'
      }
      if (stream.match(/\w+\//)) {
        return 'comment'
      }
      stream.next()
      return null
    }
  }
})
