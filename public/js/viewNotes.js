let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;
        getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
        window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}/${noteId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
    let cards = ``;
    for(const noteId in data) {
        const note = data[noteId];
        firebase.database().ref(`users/${userId}/${noteId}`).orderByValue('title');
        // For each note create an HTML card
        cards += createCard(note, noteId)
    };
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
   return `
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">${note.title}</p>
         </header>
         <div class="card-content">
           <div class="content">${note.text}</div>
         </div>
         <footer class="card-footer">
            <a id="${noteId}"
                href="#"
                class="card-footer-item"
                onclick="deleteNote('${noteId}')">
                Delete
            </a>
            <a id="${noteId}"
                href="#"
                class="card-footer-item"
                onclick="editNote('${noteId}')">
                Edit
            </a>
         </footer>
       </div>
     </div>
   `;
};

function editNote(noteId) {
    console.log('edit', noteId);

    const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`)
    notesRef.on('value', (snapshot) => {
        const note = snapshot.val();
        document.querySelector("#editTitleInput").value = note.title;
        document.querySelector("#editTextInput").value = note.text;
        document.querySelector("#noteId").value = noteId;
    }); 
    // editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.toggle('is-active');
}

function deleteNote(noteId) {
    console.log('delete', noteId);
    const result = confirm('Are you sure you want to delete this note?');
    if (result == true) {
        firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    } else {
        return !!result;
    }
    
}

// function savedEditedNote() {
//     const title = document.querySelector("#editTitleInput").value;
//     const text = document.querySelector("#editTextInput").value;
//     const noteId = document.querySelector("#noteId").value;
//     const editedNote = {
//         title,
//         text
//     }
//     firebase.database().ref(`users/${googleUserId}/${noteId}`).update(editedNote);
//     closeEditNote()
//     console.log('hi, save');
// }

function saveEditedNote() {
    const title = document.querySelector('#editTitleInput').value;
    const text = document.querySelector('#editTextInput').value;
    const noteId = document.querySelector('#noteId').value;
    const editedNote = { title, text };
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(editedNote);
    closeEditNote();
}

function closeEditNote() {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.toggle('is-active');
    console.log('hi, close')
}

// function alphabeticalOrder(userId) {
//     firebase.database().ref(`users/${userId}`).orderByValue('title');
// }

