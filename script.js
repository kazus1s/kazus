class NoteApp {
    constructor() {
      this.savedNotesContainer = document.getElementById('savedNotes');
      this.archiveContainer = document.getElementById('archiveNotes');
      this.noteForms = document.querySelectorAll('.note');
      this.setupListeners();
      this.updateNotesDisplay();
    }
  
    setupListeners() {
      this.noteForms.forEach(noteForm => {
        const textarea = noteForm.querySelector('.noteTextarea');
        const addButton = noteForm.querySelector('.add');
        addButton.addEventListener('click', (event) => {
          event.preventDefault();
          this.saveNoteTextarea(textarea);
        });
  
        textarea.addEventListener('input', () => {
          textarea.classList.remove('error');
        });
      });
    }
  
    saveNoteTextarea(textarea) {
      const note = textarea.value.trim();
  
      if (note === '') {
        textarea.classList.add('error');
        return;
      }
  
      const currentTime = new Date();
      const timeString = this.formatTime(currentTime);
      const noteData = {
        note: note,
        time: timeString,
        archived: false
      };
  
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(noteData);
      localStorage.setItem('notes', JSON.stringify(notes));
  
      const noteContainer = this.createNoteElement(noteData);
      this.savedNotesContainer.appendChild(noteContainer);
  
      textarea.value = '';
      this.updateNotesDisplay();
    }
  
    createNoteElement(noteData) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = `${noteData.note} (время: ${noteData.time})`;
  
      const deleteButton = this.createButton("Удалить", () => {
        this.deleteNoteFromLocalStorage(noteData);
      });
  
      const archiveButton = this.createButton("Архивировать", () => {
        this.archiveNoteInLocalStorage(noteData);
      });
  
      const editButton = this.createButton("Редактировать", () => {
        this.editNoteInLocalStorage(noteData);
      });
  
      const noteContainer = document.createElement('div');
      noteContainer.appendChild(noteDiv);
      noteContainer.appendChild(deleteButton);
      noteContainer.appendChild(archiveButton);
      noteContainer.appendChild(editButton);
  
      return noteContainer;
    }
  
    createArchivedNoteElement(noteData) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = `${noteData.note} (время: ${noteData.time})`;
  
      const deleteButton = this.createButton("Удалить", () => {
        this.deleteNoteFromLocalStorage(noteData);
      });
  
      const noteContainer = document.createElement('div');
      noteContainer.className = 'archived-note';
      noteContainer.appendChild(noteDiv);
      noteContainer.appendChild(deleteButton);
  
      return noteContainer;
    }
  
    createButton(text, onClickHandler) {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', onClickHandler);
      return button;
    }
  
    deleteNoteFromLocalStorage(noteData) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes = notes.filter(item => item.note !== noteData.note || item.time !== noteData.time);
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    archiveNoteInLocalStorage(noteData) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach(item => {
        if (item.note === noteData.note && item.time === noteData.time) {
          item.archived = true;
        }
      });
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    editNoteInLocalStorage(noteData) {
      const newNote = prompt("Редактировать заметку:", noteData.note);
      if (newNote === null || newNote.trim() === "") {
        return;
      }
  
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach(item => {
        if (item.note === noteData.note && item.time === noteData.time) {
          item.note = newNote;
        }
      });
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    formatTime(time) {
      return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    }
  
    updateNotesDisplay() {
      this.savedNotesContainer.innerHTML = '';
      this.archiveContainer.innerHTML = '';
  
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
  
      notes.forEach(noteData => {
        if (noteData.archived) {
          const archivedNoteContainer = this.createArchivedNoteElement(noteData);
          this.archiveContainer.appendChild(archivedNoteContainer);
        } else {
          const noteContainer = this.createNoteElement(noteData);
          this.savedNotesContainer.appendChild(noteContainer);
        }
      });
    }
  }
  
  window.onload = function() {
    new NoteApp();
  };
  