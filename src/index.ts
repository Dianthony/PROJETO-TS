(() => {

    enum NotificationPlataform{
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    enum ViewMode {
        TODO = 'TODO',
        REMINDER = 'REMINDER',
    }

    const UUID = (): string => {
        return Math.random().toString(32).substr(2, 9);
    };

    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today(): Date {
            return new Date();
        },
        formatDate(date: Date): string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
    };

    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    class Reminder implements Task{
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        date: Date = DateUtils.tomorrow();
        notifications: Array<NotificationPlataform> = [NotificationPlataform.EMAIL];

        constructor(description: string, date: Date, notifications: Array<NotificationPlataform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return `
                --> Reminder <--
                description:${this.description}
                date: ${DateUtils.formatDate(this.date)}
                plataform: ${this.notifications.join(',')}
            `;
        }

    }

    class Todo implements Task{
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        done: boolean = false;

        constructor(description: string){
            this.description = description;
        }

        render(): string {
            return `
            --> TODO <--
                description: ${this.description}
                done: ${this.done}
            `;
        }
        
    }

    const todo = new Todo('Todo criado com classe');

    const reminder = new Reminder('Reminder craido com classe', new Date(), [NotificationPlataform.EMAIL]);

    const taskView = {
        // renderiza os TODOS e os Reminders 
        // view
        getTodo(form: HTMLFormElement): Todo{
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder(form: HTMLFormElement): Reminder{
            const reminderNotifications = [
                form.notification.value as NotificationPlataform,
            ];
            const reminderDate = new Date(form.reminderDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(
                reminderDescription,
                reminderDate,
                reminderNotifications
            );
        },
        render(tasks: Array<Task>, mode: ViewMode){
            //método que recebe a lista de tasks
            const tasksList = document.getElementById('tasksList');

            while(tasksList?.firstChild){
                //limpar a lista de um a um
                tasksList.removeChild(tasksList.firstChild);
            }

            tasks.forEach((task) => {
                //iterar a lista de tasks
                //criação do elemento HTML na lista
                const li = document.createElement('LI');
                const textNode = document.createTextNode(task.render());

                li.appendChild(textNode);
                tasksList?.appendChild(li);
            });

            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if(mode === ViewMode.TODO){
                todoSet?.setAttribute('style', 'display: block');
                todoSet?.removeAttribute('disabled');
                reminderSet?.setAttribute('style', 'display: none');
                reminderSet?.setAttribute('disabled', 'true');
            } else {
                reminderSet?.setAttribute('style', 'display: block');
                reminderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'display: none');
                todoSet?.setAttribute('disabled', 'true');
            }
        }
    };

    const taskControler = (view: typeof taskView) => {
        // garante quando a view deve redenrizar e quardar em memória, dentro do navegador, as tasks
        
        const tasks: Array<Task> = [];
        let mode: ViewMode = ViewMode.TODO;

        const handleEvent = (event: Event) => {
            event.preventDefault(); // previne a atualização da página com o envio do form

            const form = event.target as HTMLFormElement;
            switch (mode as ViewMode){
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode); // chama a view para renderizar as tasks presentes na lista 
        }

        const handleToggleMode = () => {
            switch (mode as ViewMode){
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };

        document.getElementById('toggleMode')?.addEventListener('click', handleToggleMode)
        document.getElementById('taskForm')?.addEventListener('submit', handleEvent)
    };

    taskControler(taskView);
})();