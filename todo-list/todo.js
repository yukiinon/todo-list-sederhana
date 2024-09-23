class Task {
    constructor(id, title, priority, deadline) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.completed = false;
        this.deadline = new Date(deadline);
        this.createdAt = new Date();
    }

    // method untuk toggle status completed
    toggleComplete() {
        this.completed = !this.completed;
    }
}

// class untuk mengelola daftar tugas (TodoList)
class TodoList {
    constructor() {
        // ambil tasks dari LocalStorage saat halaman dimuat atau gunakan array kosong
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Menambah task ke dalam daftar dan simpan ke LocalStorage
    addTask(title, priority, deadline) {
        const id = new Date().getTime(); // ID unik untuk setiap task
        const newTask = new Task(id, title, priority, deadline);
        this.tasks.push(newTask);
        this.saveTasks(); // simpan task ke LocalStorage
    }

    // Menghapus task berdasarkan ID dan simpan perubahan ke LocalStorage
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks(); // simpan task yang tersisa ke LocalStorage
    }

    // Toggle status selesai (completed) untuk task tertentu berdasarkan ID
    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleComplete();
            this.saveTasks(); // simpan perubahan ke LocalStorage
        }
    }

    // simpan daftar tasks ke LocalStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// kelas UI untuk menangani interaksi dengan antarmuka pengguna
class UI {
    constructor(todoList) {
        this.todoList = todoList;
        this.taskListElement = document.getElementById('task-list'); // elemen HTML tempat menampilkan daftar tasks
        this.init();
    }

    // inisialisasi event listener dan menampilkan task saat halaman dimuat
    init() {
        this.renderTasks(); // tampilkan task yang ada di LocalStorage saat halaman dimuat

        // event listener untuk menambah task baru saat form disubmit
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    // menambah task baru dari form input dan render ulang task list
    addTask() {
        const title = document.getElementById('task-title').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;

        if (title && deadline) {
            this.todoList.addTask(title, priority, deadline); // tambah task ke todoList
            this.renderTasks(); // render ulang task setelah ditambah
            this.clearForm(); // bersihkan form setelah task ditambah
        }
    }

    // method untuk menampilkan daftar tasks
    renderTasks() {
        this.taskListElement.innerHTML = ''; // untuk mengkosongkan daftar task sebelum merender ulang
        const tasks = this.todoList.tasks;

        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = `task-item ${task.priority}`;
            taskElement.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.title} (${task.priority}) - Due: ${new Date(task.deadline).toLocaleDateString()}</span>
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            `;
            this.taskListElement.appendChild(taskElement);

            // event listener untuk tombol Complete(digunakan saat kita selesai mengerjakan Todo yang kita buat)
            taskElement.querySelector('.complete-btn').addEventListener('click', () => {
                this.todoList.toggleComplete(task.id);
                this.renderTasks(); // render ulang setelah status task diubah
            });

            // event listener untuk tombol Delete
            taskElement.querySelector('.delete-btn').addEventListener('click', () => {
                this.todoList.deleteTask(task.id);
                this.renderTasks(); // render ulang setelah task dihapus
            });
        });
    }

    // bersihkan form setelah task ditambah
    clearForm() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-priority').value = 'medium';
        document.getElementById('task-deadline').value = '';
    }
}

// menginisialisasi TodoList dan UI
const todoList = new TodoList();
const ui = new UI(todoList);
