import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RowNotFoundException from 'App/Exceptions/RowNotFoundException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const users = await User.all()

    return users
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const trx = await Database.transaction()
      const data = await request.validate(CreateUserValidator)
      const addresses = await request.input('addresses')

      const user = await User.create(data, trx)
      await user.related('addresses').createMany(addresses)

      await trx.commit()
      return user
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ params }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', params.id)

      return user
    } catch (error) {
      throw new RowNotFoundException(error.message, error.status, error.code)
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)
    const data = await request.only(['username', 'email'])

    await user.merge(data).save()

    return user
  }

  public async destroy({ params }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)
    await user.delete()
  }
}
