import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [rules.required(), rules.confirmed(), rules.minLength(8)]),
    token: schema.string({}, [rules.required()]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    confirmed: 'The {{field}} confirmation does not match.',
    minLength: 'The {{field}} should not be less than {{options.minLength}}',
  }
}
