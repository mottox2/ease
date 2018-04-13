// 'aaa/bbb/ccc/ddd/' => ['aaa/bbb/ccc/', 'aaa/bbb/', 'aaa/', '']
const ancestors: any = (category: string) => {
  const result = category.replace(/(.*)\/\w+/, '$1')
  console.log(result, category)
  if (result === category) {
    return '' // Root directory
  } else {
    return [result, ...ancestors(result)]
  }
}

export default ancestors
