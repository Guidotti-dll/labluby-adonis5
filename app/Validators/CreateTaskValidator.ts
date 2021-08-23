import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({}, [rules.required()]),
    due_date: schema.date(),
    description: schema.string(),
    user_id: schema.number(),
    file_id: schema.number(),
  })

  public messages = {
    required: 'The {{ field }} is required',
    date: 'The {{field}} should be a valid date',
  }
}
