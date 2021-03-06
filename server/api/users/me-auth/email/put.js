import { v4 as uuidv4 } from 'uuid'
import emailValidator from 'email-validator'
import config from '../../../../../config/server'
import { responses } from '../../../../responses'
import * as cache from '../../../../cache'
import * as util from '../../../../util'
import * as auth from '../../../../auth'
import * as database from '../../../../database'

export default {
  method: 'put',
  path: '/users/me/auth/email',
  requireAuth: true,
  schema: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        }
      },
      required: ['email']
    }
  },
  handler: async ({ req, user }) => {
    const email = util.normalize.normalizeEmail(req.body.email)
    if (!emailValidator.validate(email)) {
      return responses.badEmail
    }

    const checkUser = await database.auth.getUserByEmail({
      email
    })
    if (checkUser !== undefined) {
      return responses.badKnownEmail
    }

    if (!config.verifyEmail) {
      await database.auth.updateUser({
        id: user.id,
        email: email
      })

      return responses.goodEmailSet
    }

    const verifyUuid = uuidv4()
    await cache.login.makeLogin({ id: verifyUuid })
    const verifyToken = await auth.token.getToken(auth.token.tokenKinds.verify, {
      verifyId: verifyUuid,
      kind: 'update',
      userId: user.id,
      email
    })

    await util.email.sendVerification({
      email,
      kind: 'update',
      token: verifyToken
    })

    return responses.goodVerifySent
  }
}
