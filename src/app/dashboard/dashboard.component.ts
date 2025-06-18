import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  newTask = '';
  newCategory = '';
  newDeadline: string = '';
  selectedCategory = '';
  searchTerm = ''; // ✅ Yeni: görev başlığı arama alanı

  categories = ['İş', 'Okul', 'Kişisel', 'Diğer'];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data.map(task => ({
        ...task,
        editing: false
      }));
      this.filterTasks(); // yüklenirken filtrele
    });
  }

  addTask() {
    if (!this.newTask.trim() || !this.newCategory.trim()) return;
    this.taskService.addTask(this.newTask, this.newCategory, this.newDeadline || undefined).then(() => {
      this.newTask = '';
      this.newCategory = '';
      this.newDeadline = '';
      this.filterTasks(); // ekledikten sonra filtreyi güncelle
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  toggleComplete(task: Task) {
    this.taskService.toggleComplete(task);
  }

  editTask(task: Task) {
    task.editing = true;
  }

  saveTask(task: Task) {
    task.editing = false;
    this.taskService.updateTask(task.id!, task.title, task.category, task.dueDate);
  }

  filterTasks() {
    let tasks = this.tasks;

    // ✅ Kategoriye göre filtre
    if (this.selectedCategory) {
      tasks = tasks.filter(t => t.category === this.selectedCategory);
    }

    // ✅ Arama kutusuna göre filtre
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(term));
    }

    // ✅ Tamamlanmamışlar yukarıda
    this.filteredTasks = tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  isDeadlineUrgent(deadline?: string): boolean {
    if (!deadline) return false;
    const now = new Date();
    const due = new Date(deadline);
    const diffInHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  }

  isDeadlineSoon(deadline?: string): boolean {
    if (!deadline) return false;
    const now = new Date();
    const due = new Date(deadline);
    const diffInHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours >= 24 && diffInHours <= 72;
  }

  onLogout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
}