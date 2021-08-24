import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RowNotFoundException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response
        .status(404)
        .send({ message: 'Not found, check the fields and try again!' })
    }
    return ctx.response.status(error.status).send(error.message)
  }
}
