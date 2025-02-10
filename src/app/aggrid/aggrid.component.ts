import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { AllCommunityModule } from "ag-grid-community";

import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { TreeChecklistExample } from '../tree-checklist-example';
import { MatDialog } from '@angular/material/dialog';
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
ModuleRegistry.registerModules([AllCommunityModule]);
export interface IOlympicData {
  athlete: string,
  age: number,
  country: string,
  year: number,
  date: string,
  sport: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number
}

@Component({
  selector: 'app-aggrid',
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './aggrid.component.html',
  styleUrl: './aggrid.component.scss',
  standalone: true
})
export class AggridComponent implements AfterViewInit { 
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;

columnDefs: ColDef[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age'  },
  { field: 'country', headerName: 'Country'  }
];

rowData = [
  { name: 'John', age: 25, country: 'USA' },
  { name: 'Alidce', age: 1, country: 'Canada' },
  { name: 'Bodb', age: 2, country: 'UK' },
  { name: 'Jodhn', age: 3, country: 'USA' },
  { name: 'Alice', age: 4, country: 'Canada' },
  { name: 'Bofb', age: 5, country: 'UK' },
  { name: 'John', age: 6, country: 'USA' },
  { name: 'Alice', age: 7, country: 'Canada' },
  { name: 'Bofb', age: 8, country: 'UK' },
  { name: 'John', age: 9, country: 'USA' },
  { name: 'Aldice', age: 0, country: 'Canada' },
  { name: 'Bob', age: 22, country: 'UK' },
  { name: 'Jochn', age: 25, country: 'USA' },
  { name: 'Alvice', age: 30, country: 'Canada' },
  { name: 'Bob', age: 22, country: 'UK' }
];

sideBarConfig: SideBarDef = {
  toolPanels: [
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel'
    }
  ],
  defaultToolPanel: 'filters' // Default to show filters tool panel
};

constructor(private dialog: MatDialog) {
}

ngAfterViewInit() {
  this.agGrid.api.setSideBarVisible(false);
  this.agGrid.api.closeToolPanel(); // Ensure sidebar is hidden on load
}


openFilterModal() {
  // this.agGrid.api.openToolPanel('filters');
  this.agGrid.api.setSideBarVisible(true);
  this.dialog.open(TreeChecklistExample, {
    width: '400px',
    data: { gridApi: this.agGrid.api }
  });
}

ngOnDestroy() {
  this.agGrid.api.setSideBarVisible(false);
  this.agGrid.api.closeToolPanel(); // Hide sidebar when modal is closed
}


}
