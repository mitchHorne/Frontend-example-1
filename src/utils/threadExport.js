import { format } from 'date-fns'
import { __, concat, defaultTo, map, omit, pipe, take, trim } from 'ramda'

export const getThreadExportJson = tweets =>
  JSON.stringify(map(omit(['isQuoteBack']), tweets), null, 2)

export const getThreadExportFileName = ({ name }) =>
  pipe(
    defaultTo('thread-export'),
    take(100),
    trim,
    concat(__, ` - ${format(new Date(), 'yyyyMMdd_HHmmss')}.json`)
  )(name)
