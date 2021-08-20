import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({ trim: true }, [rules.required(), rules.minLength(8)]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    email: 'The {{field}} should be a valid email address',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
  }
}
