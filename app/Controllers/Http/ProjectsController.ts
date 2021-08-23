import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'

export default class ProjectsController {
  public async index({}: HttpContextContract) {
    const projects = await Project.query().preload('user')

    return projects
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const project = await Project.findByOrFail('id', params.id)

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({ error: error.message })
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
