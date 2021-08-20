import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import crypto from 'crypto'
import moment from 'moment'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { email, redirect_url: redirectUrl } = await request.validate(ForgotPasswordValidator)

      const user = await User.findByOrFail('email', email)

      user.reset_token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await Mail.sendLater((message) => {
        message
          .from('contato@email.com')
          .to(user.email)
          .subject('Forgot Password')
          .htmlView('emails/forgot_password', {
            email: user.email,
            token: user.reset_token,
            link: `${redirectUrl}?token=${user.reset_token}`,
          })
      })

      await user.save()
    } catch (error) {
      if (error.message === 'E_ROW_NOT_FOUND: Row not found') {
        return response.status(404).send({ error: 'User not found' })
      }
      response.badRequest(error.messages)
    }
  }
  public async update({ request, response }: HttpContextContract) {
    try {
      const { password, token } = await request.validate(ResetPasswordValidator)

      const user = await User.findBy('reset_token', token)

      if (!user) {
        console.log('entrou')
        return response.status(404).send({ error: { message: 'Token invalid' } })
      }

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'Recovery token is expired' } })
      }
      user.reset_token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }
}
