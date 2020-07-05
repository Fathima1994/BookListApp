import Store from './store';
// import { EvalSourceMapDevToolPlugin } from 'webpack';

//UI class-handle UI tasks
export default class UI{
    static displayBooks() {
        const books = Store.getBooks();;
        books.forEach((book) => UI.addBooksToList(book));
    }
    static addBooksToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td contenteditable='true' data-column-identifier="title">${book.title}</td>
            <td contenteditable='true' data-column-identifier="author">${book.author}</td>
            <td data-column-identifier="isbn">${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
        this.tds = row.querySelectorAll('td');
        this.tds.forEach((td) =>{
            if(td.hasAttribute('contenteditable')) {
                td.addEventListener('click',(ev) =>{
                    if(!this.inEditing(td)) {
                        this.startEditing(td);
                    }
                })
            }
        });
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    static removeBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            Store.removeBook(el.parentElement.previousElementSibling.textContent);
            UI.showAlert('Book Removed','success');
        }
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const form = document.querySelector('#book-form');
        const container = document.querySelector('.container');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(),1000);
    }
    static startEditing(td) {
        const activeTd = this.findEditing(td);
        if(activeTd) {
            this.cancelEditing(activeTd);
        }
        td.className = 'in-editing';
        td.setAttribute('data-old-value',td.innerHTML);
        this.createToolbar(td);
    }
    static createToolbar(td){
        const toolbar = document.createElement('div');
        toolbar.className = 'btn-toolbar';
        toolbar.setAttribute('contenteditable',false);
        toolbar.innerHTML = `
        <div class="btn-wrapper">
            <button class="btn btn-primary btn-sm btn-save">Save</button>
            <button class="btn btn-danger btn-sm btn-cancel">Cancel</button>
        </div>
        `;
        td.appendChild(toolbar);
        const btnsave = toolbar.querySelector('.btn-save');
        const btncancel = toolbar.querySelector('.btn-cancel');
        btnsave.addEventListener('click',(e) => {
            e.stopPropagation();
            this.finishEditing(td);
        });
        btncancel.addEventListener('click',(e) => {
            e.stopPropagation();
            this.cancelEditing(td);
        });
    }
    static inEditing(td){
        return td.classList.contains('in-editing');
    }
    static finishEditing(td) {
        td.classList.remove('in-editing');
        this.removeToolbar(td);
        let tdColumnName = td.getAttribute('data-column-identifier');
        let isbn;
        if(tdColumnName === 'title') {
            isbn = td.nextElementSibling.nextElementSibling.textContent;
        }
        else if(tdColumnName === 'author') {
            isbn = td.nextElementSibling.textContent;
        }
        Store.updateRecord(tdColumnName, td.innerHTML, isbn);
    }
    static removeToolbar(td) {
        const toolbar = td.querySelector('.btn-toolbar');
        toolbar.remove();
    }
    static cancelEditing(td) {
        td.innerHTML = td.getAttribute('data-old-value');
        td.classList.remove('in-editing');
    }
    static findEditing(td) {
        const list = document.querySelector('#book-list');
        const tds = list.querySelectorAll('td');
        return Array.prototype.find.call(tds, td => this.inEditing(td));
    }
}