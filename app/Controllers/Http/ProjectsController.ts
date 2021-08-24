import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RowNotFoundException from 'App/Exceptions/RowNotFoundException'
import Project from 'App/Models/Project'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const { page, perPage } = request.qs()
    const projects = await Project.query().preload('user').paginate(page, perPage)

    return projects
  }

  public async show({ params }: HttpContextContract) {
    try {
      const project = await Project.findByOrFail('id', params.id)

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      throw new RowNotFoundException(error.message, error.status, error.code)
    }
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(CreateProjectValidator)
    const project = await Project.create({ ...data, user_id: auth.user!.id })

    return project
  }

  public async update({ params, request }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    project.merge(data)
    await project.save()

    return project
  }

  public async destroy({ params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}
