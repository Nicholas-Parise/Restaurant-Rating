import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { AuthDataService } from '../shared/auth-data.component';
import { ListDataService } from '../shared/list-data.component';
import { ListEntry } from '../shared/list-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';

import { ListCardComponent } from '../list-card/list-card.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, ListCardComponent, RestaurantCardComponent, RouterLink],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {

  constructor(private authDataService: AuthDataService,
    private listDataService: ListDataService,
    private route: ActivatedRoute,
    private router: Router) { }

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
    });

    this.route.paramMap.subscribe(params => {
      this.list_id = params.get('id');
      if (this.list_id) {
        this.listDataService.getListById(this.list_id);
      }
    })

    this.listDataService.getRecommended();

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.listDataService.getLists();
        this.LoggedIn = true;
      } else {
        this.LoggedIn = false;
      }
    });
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


}
