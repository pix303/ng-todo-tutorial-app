import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo, ServerTodo } from './todo-model';
import { filter, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TodoService {
  todos: Todo[] = [];
  currentTodo$: Subject<Todo> = new Subject();

  constructor(private readonly http: HttpClient) {}

  /**
   * getByID restitusce observable di chiamata http per ottenere singolo Todo
   * @param id chiave identificativa del todo
   * @returns Observable con Todo richiesto
   */
  getByID(id: number): Observable<Todo> {
    // ---------------------------------------------
    // solo in caso dati lista sono completi, cambiando tipo restituito da metodo
    // ---------------------------------------------
    // return this.todos.find((item) => item.id === id);

    return this.http.get<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
  }

  /**
   * retriveTodoByID effettua chiamata a server e valorizza Subject che rappresenta il current Todo
   * @param id chiave identificativa del todo
   */
  retriveTodoByID(id: number): void {
    this.http
      .get<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .subscribe((res) => this.currentTodo$.next(res));
  }

  /**
   * getTodos effettua chiamata a server e restituisce observable di lista todo
   * @returns Observable lista todo
   */
  getTodos(): Observable<Todo[]> {
    // -----------------------------------------
    // esempio trasformazione json data in classi
    // -----------------------------------------
    // this.http
    //   .get<any[]>('https://jsonplaceholder.typicode.com/todos')
    //   .pipe(
    //     concatAll(),
    //     take(5),
    //     tap((data) => console.log(data)),
    //     map((data) => {
    //       return new Todo(data.id, data.title, data.completed);
    //     }),
    //     tap((data) => console.log(data)),
    //     toArray()
    //   )
    //   .subscribe((data) => {
    //     console.log('getTodos chiamata completa');
    //     this.todos = data;
    //   });

    return this.http
      .get<ServerTodo[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        map((items): Todo[] => {
          return items.map((item): Todo => {
            return {
              id: item.id,
              title: item.title,
              done: item.completed,
              userCode: item.userId,
            };
          });
        }),
        map((todos: Todo[]) => todos.filter((todo) => !todo.done))
      );
  }
  /**
   * retriveTodos effettua chiamata a server e valorizza lista esposta da service
   * @returns Observable lista todo
   */
  retriveTodos(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((data) => {
        this.todos = data;
      });
  }
}
