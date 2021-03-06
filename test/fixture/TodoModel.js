import { store, uuid } from './utils';

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
export default class TodoModel {
  constructor(key) {
    this.key = key;
    this.todos = store(key);
    this.onChanges = [];
  }

  subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  inform() {
    store(this.key, this.todos);
    this.onChanges.forEach(cb => cb());
  }

  addTodo(title) {
    this.todos = this.todos.concat({
      id: uuid(),
      title,
      completed: false,
    });

    this.inform();
  }

  toggleAll(checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map(todo => Object.assign({}, todo, { completed: checked }));
    this.inform();
  }

  toggle(todoToToggle) {
    this.todos = this.todos.map(todo => todo !== todoToToggle ?
      todo : Object.assign({}, todo, { completed: !todo.completed })
    );
    this.inform();
  }

  destroy(todo) {
    this.todos = this.todos.filter(candidate => candidate !== todo);
    this.inform();
  }

  save(todoToSave, text) {
    this.todos = this.todos.map(todo => todo !== todoToSave ?
      todo : Object.assign({}, todo, { title: text })
    );
    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.inform();
  }
}
