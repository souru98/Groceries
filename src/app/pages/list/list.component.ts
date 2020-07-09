import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Grocery } from '~/app/shared/grocery/grocery';
import { GroceryListService } from '~/app/shared/grocery/grocery-list.service';
import { TextField } from 'tns-core-modules/ui/text-field';
import * as SocialShare from 'nativescript-social-share';
import { backgroundSizeProperty } from 'tns-core-modules/ui/page/page';


@Component({
    selector: 'list',
    providers: [GroceryListService],
    templateUrl: 'app/pages/list/list.component.html',
    styleUrls: ['app/pages/list/list-common.css', 'app/pages/list/list.css']
})
export class ListComponent implements OnInit {

    public groceryList: Grocery[] = [];
    public grocery = '';
    public isLoading = false;
    public listLoaded = false;
    @ViewChild('groceryTextField') groceryTextField: ElementRef;

    constructor(private groceryListService: GroceryListService) { }

    public ngOnInit() {
        this.isLoading = true;
        this.groceryListService.load()
            .subscribe(loadedGroceries => {
                loadedGroceries.forEach((groceryObject) => {
                    this.groceryList.unshift(groceryObject);
                });
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    public add() {
        if (this.grocery.trim() === '') {
            alert('Enter a grocery item');
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this.groceryListService.add(this.grocery)
            .subscribe(
                groceryObject => {
                    this.groceryList.unshift(groceryObject);
                    this.grocery = '';
                },
                () => {
                    alert({
                        message: 'And error occurred while adding an item to your list.',
                        okButtonText: 'OK'
                    });
                    this.grocery = '';
                }
            );
    }

    public share() {
        const list = [];
        for (let i = 0, size = this.groceryList.length; i < size; i++) {
            list.push(this.groceryList[i].name);
        }
        const listString = list.join(', ').trim();
        SocialShare.shareText(listString);
    }
}
