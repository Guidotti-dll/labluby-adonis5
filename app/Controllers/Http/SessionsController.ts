import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SessionValidator from 'App/Validators/SessionValidator'

export default class SessionsController {
  public async store({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(SessionValidator)

    try {
      const token = await auth.use('api').attempt(email, password)
      const user = await User.findByOrFail('email', email)
      return { user, token }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
