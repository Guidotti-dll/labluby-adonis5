import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import File from 'App/Models/File'
import Env from '@ioc:Adonis/Core/Env'
export default class FilesController {
  public async show({ response, params }: HttpContextContract) {
    const file = await File.findByOrFail('id', params.id)

    response.download(Application.tmpPath(`/uploads/${file.file}`))
  }

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
        url: `${Env.get('APP_URL')}/files/${fileName}`,
      })
      file.merge({ url: `${Env.get('APP_URL')}/files/${file.id}` })

      await file.save()
      return file
    } catch (error) {
      console.log(error)
      return response.status(400).send({ error: { message: 'Error on upload ' } })
    }
  }
}
