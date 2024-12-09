import { curryN, join, map, replace } from 'ramda'

export const trimByChar = curryN(2, (char, value) => {
  const expression = new RegExp(`^${char}+|${char}+$`, 'g')
  return replace(expression, '', value ?? '')
})

export const joinPaths = (...paths) => {
  const trimSlash = trimByChar('/')
  return join('/', map(trimSlash, paths))
}

export const tweetCanLinkBack = (selectedTweet, quotedTweet) => {
  return (
    selectedTweet.row !== quotedTweet.row &&
    selectedTweet.row !== 0 &&
    quotedTweet.quoteTweetId !== selectedTweet.id
  )
}
