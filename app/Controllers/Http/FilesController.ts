import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import File from 'App/Models/File'
export default class FilesController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const upload = request.file('file', {
        size: '2mb',
      })

      if (!upload) {
        return
      }

      const fileName = `${cuid()}.${upload.extname}`

      await upload.move(Application.tmpPath('uploads'), {
        name: fileName,
      })

      if (upload.state === 'idle') {
        throw upload.errors
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      })

      return file
    } catch (error) {
      return response.status(400).send({ error: { message: '' } })
    }
  }
}
