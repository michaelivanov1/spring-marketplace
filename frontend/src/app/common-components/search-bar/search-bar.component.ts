import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() searchQueryChange = new EventEmitter<string>();

  searchQuery: string = '';

  filterList(): void {
    this.searchQueryChange.emit(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterList();
  }
}
