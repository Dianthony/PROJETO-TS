(() => {

    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    class Reminder implements Task{
        id: string = '';
        dateCreated: Date = new Date();
        dateUpdated: Date = new Date();
        description: string = '';

        date: Date = new Date();
        notifications: Array<string> = ['EMAIL'];

        constructor(description: string, date: Date, notifications: Array<string>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return JSON.stringify(this);
        }

    }

    class Todo implements Task{
        id: string = '';
        dateCreated: Date = new Date();
        dateUpdated: Date = new Date();
        description: string = '';

        done: boolean = false;

        constructor(description: string){
            this.description = description;
        }

        render(): string {
            return JSON.stringify(this);
        }
        
    }

    const todo = new Todo('Todo criado com classe');

    const reminder = new Reminder('Reminder craido com classe', new Date(), ['EMAIL']);

    const taskView = {
        // renderiza os TODOS e os Reminders 
        // view
        render(tasks: Array<Task>){
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
            })
        }
    };

    const taskControler = (view: typeof taskView) => {
        // garante quando a view deve redenrizar e quardar em memória, dentro do navegador, as tasks
        
        const tasks: Array<Task> = [todo, reminder];

        const handleEvent = (event: Event) => {
            event.preventDefault(); // previne a atualização da página com o envio do form
            view.render(tasks); // chama a view para renderizar as tasks presentes na lista 
        }

        document.getElementById('taskForm')?.addEventListener('submit', handleEvent)
    };

    taskControler(taskView);
})();