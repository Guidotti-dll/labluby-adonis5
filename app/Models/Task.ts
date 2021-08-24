import { DateTime } from 'luxon'
import { afterSave, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Project from './Project'
import File from './File'
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

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
  public projectId: number

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

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => File, {
    foreignKey: 'file_id',
  })
  public file: BelongsTo<typeof File>

  @afterSave()
  public static async send(task: Task) {
    const user = await User.findBy('id', task.user_id)
    const file = await File.findBy('id', task.file_id)

    await Mail.sendLater((message) => {
      message
        .from('contato@email.com')
        .to(user!.email)
        .subject('New Task')
        .htmlView('emails/new_task', {
          username: user!.username,
          title: task.title,
          hasAttachment: !!task.file_id,
        })
      if (file) {
        message.attach(Application.tmpPath(`uploads/${file!.file}`), {
          filename: file!.name,
        })
      }
    })
  }
}
