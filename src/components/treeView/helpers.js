const hasOneWayQuoteLink = (tweetId, quoteTweet) => {
  return !!quoteTweet && quoteTweet?.quoteParentId !== tweetId
}

const getNodeRelations = tweet => {
  const { replyToId, quoteTweetId, quoteParentId, isQuoteBack } = tweet

  const relations = []
  if (replyToId)
    relations.push({
      targetId: replyToId,
      sourceAnchor: 'top',
      targetAnchor: 'bottom'
    })

  if (quoteParentId)
    relations.push({
      targetId: quoteParentId,
      sourceAnchor: 'left',
      targetAnchor: 'right'
    })

  if (isQuoteBack)
    relations.push({
      targetId: quoteTweetId,
      targetAnchor: 'bottom',
      sourceAnchor: 'top',
      style: {
        strokeDasharray: '5,5'
      }
    })

  return relations
}

export { hasOneWayQuoteLink, getNodeRelations }
