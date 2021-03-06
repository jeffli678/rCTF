import { responses } from '../../responses'
import * as cache from '../../cache'
import config from '../../../config/server'

const stringDivisions = Object.values(config.divisions).map(String)

export default {
  method: 'get',
  path: '/leaderboard/now',
  requireAuth: false,
  schema: {
    query: {
      type: 'object',
      properties: {
        limit: {
          type: 'string'
        },
        offset: {
          type: 'string'
        },
        division: {
          type: 'string',
          enum: stringDivisions
        }
      },
      required: ['limit', 'offset']
    }
  },
  handler: async ({ req }) => {
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    if (limit < 0 ||
      offset < 0 ||
      limit > config.leaderboard.maxLimit ||
      offset > config.leaderboard.maxOffset) {
      return responses.badBody
    }
    const result = await cache.leaderboard.getRange({
      start: offset,
      end: offset + limit,
      division: req.query.division
    })
    return [responses.goodLeaderboard, result]
  }
}
