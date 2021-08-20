import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import crypto from 'crypto'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { email, redirect_url: redirectUrl } = await request.validate(ForgotPasswordValidator)

      console.log(redirectUrl)
      const user = await User.findByOrFail('email', email)

      user.reset_token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()
    } catch (error) {
      if (error.message === 'E_ROW_NOT_FOUND: Row not found') {
        return response.status(404).send({ error: 'User not found' })
      }
      response.badRequest(error.messages)
    }
  }
}
