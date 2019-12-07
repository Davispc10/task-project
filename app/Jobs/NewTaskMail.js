'use strict';

const Mail = use('Mail');
const Helpers = use('Helpers');

class NewTaskMail {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return 'NewTaskMail-job';
  }

  async handle({username, title, file, email}) {
    await Mail.send(
      ['emails.new_task'],
      {username, title, hasAttachment: !!file},
      message => {
        message
          .to(email)
          .from('david.tetradev@gmail.com', 'David | Tetra')
          .subject('Nova tarefa para voce!');

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name,
          });
        }
      }
    );
  }
}

module.exports = NewTaskMail;
