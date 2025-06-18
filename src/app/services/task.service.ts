import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { getAuth } from 'firebase/auth';

export interface Task {
  id?: string;
  title: string;
  completed: boolean;
  category: string;
  uid: string;
  createdAt: number;
  dueDate?: string; // ISO 8601 tarih string
  editing?: boolean; // ❗️UI tarafında düzenleme için geçici alan
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private firestore = inject(Firestore);
  private auth = getAuth();

  // Kullanıcıya özel görevleri getir
  getTasks(): Observable<Task[]> {
    const user = this.auth.currentUser;
    if (!user) {
      // kullanıcı login olmamışsa boş array dön
      return of([]);
    }

    const q = query(
      collection(this.firestore, 'tasks'),
      where('uid', '==', user.uid)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
  }

  // Görev ekle
  addTask(title: string, category: string, dueDate?: string) {
    const user = this.auth.currentUser;
    if (!user) return Promise.reject('Kullanıcı oturum açmamış.');

    const task: Task = {
      title,
      category,
      completed: false,
      uid: user.uid,
      createdAt: Date.now(),
      dueDate: dueDate || undefined
    };

    return addDoc(collection(this.firestore, 'tasks'), task);
  }

  // Görev sil
  deleteTask(id: string) {
    return deleteDoc(doc(this.firestore, `tasks/${id}`));
  }

  // Tamamlandı / geri al
  toggleComplete(task: Task) {
    if (!task.id) return Promise.reject('Görev ID eksik.');
    return updateDoc(doc(this.firestore, `tasks/${task.id}`), {
      completed: !task.completed
    });
  }

  // Görev güncelle
  updateTask(id: string, newTitle: string, newCategory: string, newDueDate?: string) {
    return updateDoc(doc(this.firestore, `tasks/${id}`), {
      title: newTitle,
      category: newCategory,
      dueDate: newDueDate || null
    });
  }
}