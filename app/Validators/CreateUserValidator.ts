import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({}, [
      rules.required(),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, [rules.required(), rules.confirmed(), rules.minLength(8)]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    unique: 'The {{ field }} not available',
    email: 'The {{field}} should be a valid email address',
    confirmed: 'The {{field}} confirmation does not match.',
    minLength: 'The {{field}} should not be less than {{options.minLength}}.',
  }
}
