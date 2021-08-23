import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    title: schema.string({}, [rules.required()]),
    description: schema.string({}, [rules.required()]),
  })

  public messages = {
    required: 'The {{ field }} is required',
  }
}
