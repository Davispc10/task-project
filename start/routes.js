'use strict';

const Route = use('Route');

Route.post('users', 'UserController.store').validator('User');
Route.post('sessions', 'SessionController.store').validator('Session');

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
);
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
);

Route.get('files/:id', 'FileController.show').middleware([
  'auth',
  'can:(read_posts || read_private_posts)',
]);

Route.group(() => {
  Route.post('files', 'FileController.store');

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map([[['projects.store'], ['Project']]]));

  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['projects.tasks.store'], ['Task']]]));
}).middleware(['auth', 'is:(administrator || moderator)']);

Route.resource('permissions', 'PermissionController')
  .apiOnly()
  .middleware('auth');

Route.resource('roles', 'RoleController')
  .apiOnly()
  .middleware('auth');
