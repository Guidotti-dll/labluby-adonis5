import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RowNotFoundException from 'App/Exceptions/RowNotFoundException'
import Task from 'App/Models/Task'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'

export default class TasksController {
  public async index({ params }: HttpContextContract) {
    const tasks = await Task.query().where('project_id', params.project_id).preload('user')
    return tasks
  }

  public async show({ params }: HttpContextContract) {
    try {
      const task = await Task.findByOrFail('id', params.id)

      return task
    } catch (error) {
      throw new RowNotFoundException(error.message, error.status, error.code)
    }
  }

  public async store({ request, params }: HttpContextContract) {
    const data = await request.validate(CreateTaskValidator)
    const task = await Task.create({ ...data, projectId: +params.project_id })

    return task
  }

  public async update({ params, request }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    task.merge(data)
    await task.save()

    return task
  }

  public async destroy({ params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    await task.delete()
  }
}
