import {Component, OnInit, AfterViewChecked, ElementRef} from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewChecked {

    data: any = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
        list: []
    };
    list = this.data.list;
    number: number = (localStorage.getItem('number')) ? JSON.parse(localStorage.getItem('number')) : 1;

    constructor(private elementRef:ElementRef) {
    }

    ngOnInit() {
        this.buildList();
    }

    ngAfterViewChecked() {
        $('.list__li-icons-block').on("click", '.list__icon_up ', this.moveDataUp);
        $('.list__li-icons-block').on("click", '.list__icon_down ', this.moveDataDown);
        $('.list__li-icons-block').on("click", '.list__icon_done', this.doneItem);
        $('.list__li-icons-block').on("click", '.list__icon_undone ', this.undoneItem);
        $('.list__li-icons-block').on("click", '.list__icon_del ', this.deleteItem);
    }

    buildList = () => {
        let listUL = $('.list__ul');
        let li: string = "";
        listUL.children().remove();
        for (let i = 0; i < this.list.length; i++) {
            if( !this.list[i].done ) {
                 li =
                    `<li class="list__item">
                    <div class="list__li-text-block">
                        <span class="list__item-number">${this.list[i].number}</span>
                          ${this.list[i].text}
                    </div>
                    <div class="list__li-icons-block">
                        <i class="fas fa-arrow-up list__icon list__icon_up"></i>
                        <i class="fas fa-arrow-down list__icon list__icon_down"></i>
                        <i class="fas fa-check list__icon list__icon_done"></i>
                        <i class="fas fa-undo list__icon list__icon_undone list_hide"></i>
                        <i class="fas fa-trash list__icon  list__icon_del"></i>
                    </div>
                   </li>`;
            } else {
                 li =
                `<li class="list__item list__item_done">
                    <div class="list__li-text-block">
                        <span class="list__item-number">${this.list[i].number}</span>
                          ${this.list[i].text}
                    </div>
                    <div class="list__li-icons-block">
                        <i class="fas fa-arrow-up list__icon list__icon_up"></i>
                        <i class="fas fa-arrow-down list__icon list__icon_down"></i>
                        <i class="fas fa-check list__icon list__icon_done list_hide"></i>
                        <i class="fas fa-undo list__icon list__icon_undone"></i>
                        <i class="fas fa-trash list__icon  list__icon_del"></i>
                    </div>
                   </li>`;
            }
            listUL.append(li);
        }
        console.log(this.list);
    }

    addListItem = () => {
        const input: any = $('.list__add-input');
        if ( input.val() ) {
            this.list.push({
                'number': this.number,
                'text': input.val(),
                'done': false
            });
            input.val('');
            this.number++;
            localStorage.setItem('number', JSON.stringify(this.number));
            localStorage.setItem('todoList', JSON.stringify(this.data));
            this.buildList();
        }
    }

    doneItem = (e) => {
        let target = $(e.target);
        let itemNumber = +target.parent().siblings('.list__li-text-block').find('.list__item-number').html();
        for( let i = 0; i < this.list.length; i++ ) {
            if ( itemNumber ==  this.list[i].number ) {
                this.list[i].done = true;
            }
        }
        localStorage.setItem('number', JSON.stringify(this.number));
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

    undoneItem = (e) => {
        let target = $(e.target);
        let itemNumber = +target.parent().siblings('.list__li-text-block').find('.list__item-number').html();
        for( let i = 0; i < this.list.length; i++ ) {
            if ( itemNumber ==  this.list[i].number ) {
                this.list[i].done = false;
            }
        }
        localStorage.setItem('number', JSON.stringify(this.number));
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

    deleteItem = (e) => {
        let target = $(e.target);
        let itemNumber = +target.parent().siblings('.list__li-text-block').find('.list__item-number').html();
        for( let i = 0; i < this.list.length; i++ ) {
            if ( itemNumber ==  this.list[i].number ) {
                this.list.splice(i, 1);
            }
        }
        localStorage.setItem('number', JSON.stringify(this.number));
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

     move = (array, element, delta) => {
        let index = array.indexOf(element);
        let newIndex = index + delta;
        if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
        let indexes = [index, newIndex].sort(function (a, b) {
            return a - b;
        });
        array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
    }

    moveUp = (array, element) => {
        this.move(array, element, -1);
    }

    moveDown = (array, element) => {
        this.move(array, element, 1);
    }

     moveDataUp = (e) => {
        let target = $(e.target);
        let li = target.parent().parent();
        let itemNumber = +target.parent().siblings('.list__li-text-block').find('.list__item-number').html();
        li.insertBefore(li.prev());
        $.each(this.list, (i, item) => {
            if (itemNumber == item.number) {
                this.moveUp(this.list, item);
                return false;
            }
        });
         localStorage.setItem('todoList', JSON.stringify(this.data));
         this.buildList();
    }

    moveDataDown = (e) => {
        let target = $(e.target);
        let li = target.parent().parent();
        let itemNumber = +target.parent().siblings('.list__li-text-block').find('.list__item-number').html();
        li.insertAfter(li.next());
        $.each(this.list, (i, item) => {
            if (itemNumber == item.number) {
                this.moveDown(this.list, item);
                return false;
            }
        });
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

    sortByNumber = () => {
        this.list.sort(function(item1:any, item2:any) {
            return parseInt(item1.number) - parseInt(item2.number);
        });
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

    sortByName = () => {
        this.list.sort(function(item1:any, item2:any) {
            if ( item1.text > item2.text ) return 1;
            if ( item1.text == item2.text ) return 0;
            else return -1;
        });
        localStorage.setItem('todoList', JSON.stringify(this.data));
        this.buildList();
    }

    resetList() {
        localStorage.clear();
        $('.list__ul').children().remove();
    }

}
