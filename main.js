import "./style.scss";
import Book from './book';
import Store from './store';
import UI from './ui';

//event listener to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks());

//event to add a book
document.querySelector('#book-form').addEventListener('submit',(e) =>{
    //prevent default submit
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all the details', 'danger');
    } else {
        const book = new Book(title, author, isbn);

        UI.addBooksToList(book);
        Store.addBook(book);
        UI.showAlert('Book Added','success');
        //clear values
        UI.clearFields();
    }
});

//event to delete
document.querySelector('#book-list').addEventListener('click',(e) => {
    UI.removeBook(e.target);
});

//event to change
document.querySelector('#book-list').addEventListener('change',(e) => {
    UI.removeBook(e.target);
});