document.addEventListener('DOMContentLoaded', () => {
    const tasks = [
      {
          id: '1138465078061',
          completed: false,
          text: 'Посмотреть новый урок по JavaScript',
      },
      {
          id: '1138465078062',
          completed: false,
          text: 'Выполнить тест после урока',
      },
      {
          id: '1138465078063',
          completed: false,
          text: 'Выполнить ДЗ после урока',
      },
    ];
    
    const formSubmit = document.querySelector('.create-task-block'); //Форма
    
    const errorEmptyField = document.createElement('span'); //Сообщение ошибки
    errorEmptyField.textContent = 'Название задачи не должно быть пустым';
    errorEmptyField.className = 'error-message-block';
    
    const errorRepeatingTheTask = document.createElement('span'); //Сообщение ошибки
    errorRepeatingTheTask.textContent = 'Задача с таким названием уже существует';
    errorRepeatingTheTask.className = 'error-message-block';
      
    //Создание новой задачи
    formSubmit.addEventListener('submit', (event) => {
      event.preventDefault();
    
      const { target } = event;
      let newObj = {  //Новый объект куда записывается задача
        id: `${Date.now()}`,
        completed: false,
        text: '',
      };
    
      const addTask = target.elements.taskName.value;
      let isTaskAlreadyExist = false; //Переменная для проверки на одинаковые задачи
    
      for (let i = 0; i < tasks.length; i++) { //Проверка на одинаковые задачи
        if (tasks[i].text === addTask) {
          isTaskAlreadyExist = true;
        };
      }
    
          if (!addTask) { //Проверка какую ошибку нужно показать (если она есть)
            formSubmit.insertAdjacentElement('beforeend', errorEmptyField);
            errorRepeatingTheTask.remove();
          } else if (isTaskAlreadyExist) {
            formSubmit.insertAdjacentElement('beforeend', errorRepeatingTheTask);
            errorEmptyField.remove();
          }
    
          if (addTask && isTaskAlreadyExist === false) { //Добавление новой задачи и удаление ошибок (также нужно удалять ошибки в проверке, чтобы они не накладывались друг на друга)
            newObj.text = addTask;
            tasks.unshift(newObj);
            addTaskList(tasksList, tasks);
            errorEmptyField.remove();
            errorRepeatingTheTask.remove();
          } 
    
          if (theme === false) { //Пришлось добавить сюда условие с темой потому что в тёмной теме при добавлении новой задачи цвет становился обратно чёрного цвета
            let taskItemForTheme = document.querySelectorAll('.task-item');
            taskItemForTheme.forEach(item => {
              item.style.color = '#ffffff';
            });
          };
    });
    
    
    const tasksList = document.querySelector('.tasks-list'); //Здесь задачи :)
    let taskIdList; //Хранение дата атрибута
    
    tasksList.addEventListener('click', (event) => { //Показываем модальное окно (делегирование событий)
      const { target } = event;
      if (target.className.includes('task-item__delete-button')) {
        let openModal = modal.querySelector('.modal-overlay_hidden');
        openModal.style.opacity = '1';
        openModal.style.top = '0%'
      }
      divTask = target.closest("[data-item-id]"); //Див который удаляется при нажатии кнопки удалить
      taskIdList = target.closest("[data-item-id]").getAttribute('data-item-id'); //Получение дата атрибута
      console.log(divTask)
    });
    
      function addTaskList(tasksList, arrTask) {
        tasksList.innerHTML = ''; //Очищаем лист чтобы записывать только с новой задачей а не новый массив добавлять к старому
    
        arrTask.forEach(item => { //Вёртска задач
          tasksList.innerHTML += `
          <div class="task-item" data-item-id=${item.id}>
            <div class="task-item__main-container">
                <div class="task-item__main-content">
                    <form class="checkbox-form">
                        <input class="checkbox-form__checkbox" type="checkbox" id=${item.id}>
                        <label for=${item.id}></label>
                    </form>
                    <span class="task-item__text">
                       ${item.text}
                    </span>
                </div>
                <button class="task-item__delete-button default-button delete-button">
                    Удалить
                </button>
            </div>
          </div>`;
         });     
      }
      addTaskList(tasksList, tasks);
    
      let modal = document.createElement('div'); //Вёрстка модального окна
      modal.innerHTML = `
      <div class="modal-overlay modal-overlay_hidden">
          <div class="delete-modal">
              <h3 class="delete-modal__question">
                  Вы действительно хотите удалить эту задачу?
              </h3>
              <div class="delete-modal__buttons">
                  <button class="delete-modal__button delete-modal__cancel-button">
                      Отмена
                  </button>
                  <button class="delete-modal__button delete-modal__confirm-button">
                      Удалить
                  </button>
              </div>
          </div>
      </div>
      `
      document.body.append(modal); //Добавление модального окна на страницу
      
      function hideModal() {
        let hideModal = modal.querySelector('.modal-overlay_hidden');
        hideModal.style.opacity = '0';
        hideModal.style.top = '100%'
      }
    
      const closeModal = modal.querySelector('.delete-modal__buttons'); //Закрытие модального окна (делегирование событий)
      
      closeModal.addEventListener('click', (event) => {
        const { target } = event;
        if (target.className.includes('delete-modal__cancel-button')) {
          hideModal();
        }
        if (target.className.includes('delete-modal__confirm-button')) {
           const findIdTask = tasks.findIndex(item => item.id === String(taskIdList)); //Удаляем объект по индексу у которого совпадает дата атрибут
           tasks.splice(findIdTask, 1);  
           divTask.remove();
    
           hideModal();
        }
      });
    
    
      let theme = true; //Переключение темы
    
      document.addEventListener('keydown', (event) => {
       let taskItemForTheme = document.querySelectorAll('.task-item'),
           allButtonsForTheme = document.querySelectorAll('button');
    
        const { key } = event;
        if (key === 'CapsLock') { //Указываем клавишу переключения
          theme = !theme;
          //Стили для тёмного режима и светлого false - тёмный, true - светлый
          if (theme === false) {
            document.body.style.background = '#24292E';
            document.body.style.transition = '0.5s ease'
    
            taskItemForTheme.forEach(item => {
              item.style.color = '#ffffff';
              item.style.transition = '0.5s ease'
            });
    
            allButtonsForTheme.forEach(button => {
              button.style.border = '1px solid #ffffff';
              button.style.transition = '0.5s ease'
            });
          };
    
          if (theme === true) {
            document.body.style.background = 'initial';
            taskItemForTheme.forEach(item => {
              item.style.color = 'initial';
            });
    
            allButtonsForTheme.forEach(button => {
              button.style.border = 'none';
            });
          };
    
        };
    
      });
    
    });
    
    
    
    