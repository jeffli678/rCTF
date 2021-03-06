import { v4 as uuidv4 } from 'uuid'
import * as database from '../database'
import { getToken, tokenKinds } from './token'
import { responses } from '../responses'

export const register = async ({ division, email, name, ctftimeId }) => {
  const userUuid = uuidv4()
  try {
    await database.auth.makeUser({
      division,
      email,
      name,
      id: userUuid,
      ctftimeId,
      perms: 0
    })
  } catch (e) {
    if (e.constraint === 'users_ctftime_id_key') {
      return responses.badKnownCtftimeId
    }
    if (e.constraint === 'users_email_key') {
      return responses.badKnownEmail
    }
    if (e.constraint === 'users_name_key') {
      return [responses.badKnownName, name]
    }
    throw e
  }
  const authToken = await getToken(tokenKinds.auth, userUuid)
  const teamToken = await getToken(tokenKinds.team, userUuid)
  return [responses.goodRegister, {
    authToken,
    teamToken
  }]
}
