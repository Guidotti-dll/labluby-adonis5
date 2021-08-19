import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const users = await User.all()

    return users
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateUserValidator)

      const user = await User.create(data)

      return user
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)

    return user
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
