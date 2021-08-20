/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('sessions', 'SessionsController.store')
Route.post('files', 'FilesController.store')
Route.post('forgot-password', 'ForgotPasswordsController.store')
Route.patch('reset-password', 'ForgotPasswordsController.update')
Route.post('users', 'UsersController.store')

Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly().only(['show', 'destroy', 'update'])
}).middleware('auth')
