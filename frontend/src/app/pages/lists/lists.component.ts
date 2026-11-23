import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { AuthDataService } from '../../_shared/auth-data.component';
import { ListDataService } from '../../_shared/list-data.component';
import { ListEntry } from '../../_shared/list-entry.model';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';

import { ListCardComponent } from '../../list-card/list-card.component';
import { RestaurantCardComponent } from '../../restaurant-card/restaurant-card.component';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { ReportModalService } from '../../_shared/reportModal.service';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';


@Component({
    selector: 'app-lists',
    imports: [CommonModule, FormsModule, ListCardComponent, RestaurantCardComponent, RouterLink],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.css',
    standalone: true
})
export class ListsComponent implements OnInit {

  constructor(private authDataService: AuthDataService,
    private listDataService: ListDataService,
    private reportModalService:ReportModalService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document) { }

  userListSubscription = new Subscription();
  userList: ListEntry[];

  listSubscription = new Subscription();
  listEntry: ListEntry[];
  restaurantEntry: RestaurantEntry[];

  LoggedIn: boolean = false;
  list_id: string | null;

  showNewListModal: boolean = false;
  newListName: string = '';
  newListDescription: string | null = '';
  isEditMode: boolean = false;
  editingListId: number | null = null;

  showDeleteConfirm: boolean = false;
  selectedList: ListEntry | null = null;

  ngOnInit(): void {

    this.userListSubscription = this.listDataService.userListSubject.subscribe(userList => {
      this.userList = userList;
    });

    this.listSubscription = this.listDataService.listSubject.subscribe(listEntry => {
      this.listEntry = listEntry;
      this.restaurantEntry = this.listDataService.restaurantEntry;
      if(this.listEntry && this.list_id){
        this.setSEO(this.listEntry[0]);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.list_id = params.get('id');

      this.authDataService.getIsLoggedIn().then(isLoggedIn => {

        this.LoggedIn = isLoggedIn;
        
        if (this.list_id) {
          this.listDataService.getListById(this.list_id);
        } else {
          this.setBaseSEO();
          if (isLoggedIn) {
            this.listDataService.getLists();
          }
          this.listDataService.getRecommended();
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.userListSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }


  openNewListModal() {
    this.showNewListModal = true;
    this.isEditMode = false;
    this.editingListId = null;
    this.newListName = '';
    this.newListDescription = '';
  }

  openEditListModal(list: ListEntry) {
    this.showNewListModal = true;
    this.isEditMode = true;
    this.editingListId = list.id;
    this.newListName = list.name;
    this.newListDescription = list.description;
  }

  closeNewListModal() {
    this.showNewListModal = false;
    this.newListName = '';
    this.newListDescription = '';
  }


  submitList() {
    if (!this.newListName.trim()) return;

    const list = new ListEntry(
      0,
      0,
      this.newListName,
      this.newListDescription,
      new Date(),
      new Date(),
      "null",
      "null");

    if (this.isEditMode && this.editingListId !== null) {
      this.listDataService.editList(list, this.editingListId);
    } else {
      this.listDataService.createList(list);
    }

    this.closeNewListModal();
  }

  openDeleteConfirm(list: ListEntry): void {
    this.selectedList = list;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.selectedList = null;
  }


  confirmDelete() {
    if (this.selectedList) {
      this.listDataService.deleteList(this.selectedList.id);
      this.closeDeleteConfirm();
      this.router.navigate(['/List']);
    }
  }


  isOwner(list: ListEntry): boolean {
    return list.owner_username == this.authDataService.getUsername();
  }


  follow(list: ListEntry): void {
    console.log("TBD DOES NOTHING")
  }


  report(list: ListEntry): void {
    this.reportModalService.open({
      type: 'list',
      data: list
    });
  }


setBaseSEO() {

  const url = `https://deglazd.com/list`;

  const description =
    `Create and share your own lists or find a recommended list so amazing you wish you made it yourself all on Deglazd.`;

  // title
  this.title.setTitle(
    `Lists | Deglazd`
  );

  // description
  this.meta.updateTag({
    name: 'description',
    content: description
  });

  // OpenGraph
  this.meta.updateTag({
    property: 'og:title',
    content: `Lists | Deglazd`
  });

  this.meta.updateTag({
    property: 'og:description',
    content: description
  });

  this.meta.updateTag({
    property: 'og:url',
    content: url
  });

  this.meta.updateTag({
    property: 'og:type',
    content: 'website'
  });

  // canonical
  let link: HTMLLinkElement =
    this.document.querySelector("link[rel='canonical']") ||
    this.document.createElement('link');

  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', url);

  this.document.head.appendChild(link);
}




setSEO(list: ListEntry) {

  const url = `https://deglazd.com/list/${list.id}`;

  const description =
    `${list.owner_username} has made the amazing list: ${list.name}. You can see all their carefully hand picked restaurants only on Deglazd.`;

  // title
  this.title.setTitle(
    `${list.owner_username}'s ${list.name} List | Deglazd`
  );

  // description
  this.meta.updateTag({
    name: 'description',
    content: description
  });

  // OpenGraph
  this.meta.updateTag({
    property: 'og:title',
    content: `${list.owner_username}'s ${list.name} List | Deglazd`
  });

  this.meta.updateTag({
    property: 'og:description',
    content: description
  });

  this.meta.updateTag({
    property: 'og:url',
    content: url
  });

  this.meta.updateTag({
    property: 'og:type',
    content: 'website'
  });

  // canonical
  let link: HTMLLinkElement =
    this.document.querySelector("link[rel='canonical']") ||
    this.document.createElement('link');

  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', url);

  this.document.head.appendChild(link);
}

}
