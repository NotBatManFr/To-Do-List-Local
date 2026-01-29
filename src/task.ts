import edit from './assets/edit.png';
import save from './assets/save.png';
import del from './assets/trash.png';
import taskList from './lists';
import { Task } from './types/Task.interface';
import { TaskFormElements } from './types/TaskFormElements.interface';
import { Priority } from './types/Priority.enum';

function createTask(): TaskFormElements {
  const taskForm = document.createElement('form');
  const task = document.createElement('input');
  const dueDate = document.createElement('input');
  const priority = document.createElement('select');
  const optionDefaultPriority = document.createElement('option');
  const optionHighPriority = document.createElement('option');
  const optionNormalPriority = document.createElement('option');
  const optionLowPriority = document.createElement('option');

  setAttributes(task, {
    type: "text",
    name: "task",
    placeholder: "Task"
  });

  setAttributes(dueDate, {
    type: "datetime-local",
    name: "dueDate",
    placeholder: "Due Date",
    value: "",
    required: "true"
  });

  setAttributes(priority, {
    name: "priority",
    required: "true"
  });

  setAttributes(optionDefaultPriority, {
    disabled: "true",
    selected: "true",
    hidden: "true",
    value: ""
  });

  optionDefaultPriority.textContent = "Priority";
  optionHighPriority.setAttribute("value", Priority.High);
  optionNormalPriority.setAttribute("value", Priority.Normal);
  optionLowPriority.setAttribute("value", Priority.Low);
  optionHighPriority.textContent = Priority.High;
  optionNormalPriority.textContent = Priority.Normal;
  optionLowPriority.textContent = Priority.Low;

  priority.append(optionDefaultPriority, optionHighPriority, optionNormalPriority, optionLowPriority);
  
  const actionButtons = addActionButtons(taskForm);
  
  taskForm.append(task, dueDate, priority, actionButtons[0], actionButtons[1], actionButtons[2]);
  
  const container = document.querySelector('#tasksContainer');
  if (container) {
    container.appendChild(taskForm);
  }

  return { taskForm, task, dueDate, priority, actionButtons };
}

function addActionButtons(form: HTMLFormElement): [HTMLButtonElement, HTMLButtonElement, HTMLButtonElement] {
  const saveButton = document.createElement('button');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  setAttributes(saveButton, {
    class: 'save',
    type: 'submit'
  });
  
  setAttributes(editButton, {
    hidden: 'true',
    class: 'edit',
    type: 'submit'
  });
  
  setAttributes(deleteButton, {
    class: 'delete',
    type: 'button'
  });

  saveButton.addEventListener('click', (event: Event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const task = formDataToTask(formData);
    
    if (task) {
      taskList.addInList(task);
      disableFormFields(form);
      editButton.hidden = false;
      saveButton.hidden = true;
      storeTasks(taskList.getAllTasks());
    }
  });

  editButton.addEventListener('click', (event: Event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const task = formDataToTask(formData);
    
    if (task) {
      taskList.removeFromList(task);
      enableFormFields(form);
      editButton.hidden = true;
      saveButton.hidden = false;
    }
  });

  deleteButton.addEventListener('click', () => {
    if (confirm("Delete for sure?")) {
      const formData = new FormData(form);
      const task = formDataToTask(formData);
      
      if (task) {
        taskList.removeFromList(task);
      }
      
      form.remove();
      storeTasks(taskList.getAllTasks());
    }
  });

  const saveIcon = document.createElement('img');
  const editIcon = document.createElement('img');
  const delIcon = document.createElement('img');
  
  saveIcon.src = save;
  saveIcon.alt = 'save';
  saveButton.appendChild(saveIcon);
  
  editIcon.src = edit;
  editIcon.alt = 'edit';
  editButton.appendChild(editIcon);
  
  delIcon.src = del;
  delIcon.alt = 'delete';
  deleteButton.appendChild(delIcon);

  return [saveButton, editButton, deleteButton];
}

function formDataToTask(formData: FormData): Task | null {
  const task = formData.get('task');
  const dueDate = formData.get('dueDate');
  const priority = formData.get('priority');

  if (
    typeof task === 'string' &&
    typeof dueDate === 'string' &&
    (priority === Priority.Low || priority === Priority.Normal || priority === Priority.High)
  ) {
    return { task, dueDate, priority };
  }

  return null;
}

function setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function storeTasks(tasks: Task[]): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadData(): void {
  const tasksData = localStorage.getItem('tasks');
  const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
  
  const container = document.querySelector('#tasksContainer');
  if (container) {
    container.innerHTML = '';
  }

  for (const task of tasks) {
    taskList.addInList(task);
    const taskFields = createTask();
    populateValues(taskFields, task);
    disableFormFields(taskFields.taskForm);
    taskFields.actionButtons[0].hidden = true;
    taskFields.actionButtons[1].hidden = false;
  }
}

function populateValues(target: TaskFormElements, source: Task): void {
  target.task.value = source.task;
  target.dueDate.value = source.dueDate;
  target.priority.value = source.priority;
}

function disableFormFields(form: HTMLFormElement): void {
  Array.from(form.children).forEach(child => {
    if (child.tagName !== 'BUTTON' && (child instanceof HTMLInputElement || child instanceof HTMLSelectElement)) {
      child.disabled = true;
    }
  });
}

function enableFormFields(form: HTMLFormElement): void {
  Array.from(form.children).forEach(child => {
    if (child instanceof HTMLInputElement || child instanceof HTMLSelectElement) {
      child.disabled = false;
    }
  });
}

export { createTask, loadData };