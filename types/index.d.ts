declare module 'linkify-urls' {
  type LinkifyUrls = (text: string, options: Object) => string
  var linkifyUrls: LinkifyUrls
  export default linkifyUrls
}
