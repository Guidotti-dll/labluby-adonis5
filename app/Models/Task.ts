import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Project from './Project'
import File from './File'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public user_id: number

  @column()
  public project_id: number

  @column()
  public file_id: number

  @column.dateTime({ autoCreate: true })
  public due_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Project, {
    foreignKey: 'project_id',
  })
  public project: BelongsTo<typeof Project>

  @belongsTo(() => File, {
    foreignKey: 'file_id',
  })
  public file: BelongsTo<typeof File>
}
