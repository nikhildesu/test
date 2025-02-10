    import {AfterViewInit, Component, HostListener, Inject, Injectable, OnDestroy} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource} from '@angular/material/tree';
import {of as ofObservable, Observable, BehaviorSubject} from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';

interface TreeNode {
    name: string;
    children?: TreeNode[];
    expanded?: boolean; // For toggling visibility
    searchText?: string; // For search input
  }
/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-checklist-example',
  templateUrl: 'tree-checklist-example.html',
  styleUrls: ['tree-checklist-example.css'],
  imports: [FormsModule,MatInputModule,NgFor,NgIf,
    MatTreeModule, MatCheckboxModule, MatIconModule, MatFormFieldModule,MatDialogModule,MatFormFieldModule, MatButtonModule
  ],
  standalone: true,
})
export class TreeChecklistExample implements AfterViewInit, OnDestroy {
  private filtersWithMoreThanFiveItems = new Set<string>(); // Tracks filters where "Show More" was added
  private manuallyExpandedFilters = new Set<string>();
  private showMoreClicked = new Set<string>();
  private eventListenersAdded = false; // Flag to prevent multiple event bindings
  private fulldiv = document.getElementById('overlay')
  loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngAfterViewInit() {
   
    
    console.log('oninit')
    const filterPanel = this.data.gridApi.getToolPanelInstance('filters');
    if (filterPanel) {
      const container = document.getElementById('filterPanelContainer');
      if (container) {
        container.innerHTML = ''; // Clear previous content
        container.appendChild(filterPanel.getGui()); // Append AG Grid filter panel
        // Only add event listeners once
        if (!this.eventListenersAdded) {
          this.listenForFilterExpansion();
          this.eventListenersAdded = true;
        }
      }
    }
    this.adjustModalHeight();
  }

  private listenForFilterExpansion() {
    console.log('listenForFilterExpansion')
    const filterPanels = document.querySelectorAll('.ag-filter-toolpanel-group-wrapper');

    filterPanels.forEach((filterPanel: any, index: number) => {
      if (!filterPanel.id) {
        filterPanel.id = `filterPanel-${index}`;
      }

      const filterHeader = filterPanel.querySelector('.ag-filter-toolpanel-header');
      if (!filterHeader) return;

      // Attach event listener only if not already added
      if (!filterHeader.hasAttribute('data-listener-added')) {
        filterHeader.setAttribute('data-listener-added', 'true');

        filterHeader.addEventListener('click', () => {
          this.showSpinner(filterPanel); 
          setTimeout(() => {
            this.applyShowMoreToExpandedFilter(filterPanel);
            this.hideSpinner(filterPanel); 
          }, 100); // Keeping timeout to fix scroll issue
        });
      }
       // Collapse the panel (if any collapse logic is implemented)
      const collapseButton = filterPanel.querySelector('.ag-filter-toolpanel-header');
      const isExpanded = filterPanel.querySelector('.ag-filter-toolpanel-header').ariaExpanded
      // set default view to collapse
      if (collapseButton && isExpanded === 'true') {
        collapseButton.click(); // Trigger the collapse action if needed
      }
    });
  }

  private applyShowMoreToExpandedFilter(filterPanel: any) {
    console.log('applyShowMoreToExpandedFilter')
    const filterItems = filterPanel.querySelectorAll('.ag-virtual-list-item.ag-filter-virtual-list-item');
    const initialfilterPanel = filterPanel.querySelector('.ag-virtual-list-viewport');
    const alreadyExpanded = this.filtersWithMoreThanFiveItems.has(filterPanel.id);
    const showMoreAlreadyClicked = this.showMoreClicked.has(filterPanel.id);
    const showMoreButton = filterPanel.querySelector('.show-more-button');

    const currentState = filterPanel.querySelector('.ag-filter-toolpanel-header').ariaExpanded;
    if (currentState === 'false') {
      if (initialfilterPanel) {
        initialfilterPanel.style.overflow = 'hidden';
        filterPanel.querySelector('.ag-set-filter-list').style.height = 'none';
      }
    }

    if (filterItems.length > 5) {
      if (showMoreAlreadyClicked) {
        filterItems.forEach((item: any) => (item.style.display = 'block'));
        const filterList = filterPanel.querySelector('.ag-set-filter-list');
        if (filterList) {
          filterList.style.height = 'auto';
        }
        if (showMoreButton) showMoreButton.remove();
      } else if (showMoreButton && !showMoreAlreadyClicked) {
        filterItems.forEach((item: any, index: number) => {
          if (index >= 5) item.style.display = 'none';
        });

        if (initialfilterPanel) {
          initialfilterPanel.style.overflow = 'hidden';
          if (!filterPanel.querySelector('.show-more-button')) {
            initialfilterPanel.style.height = '100px !important';
          }
        }
      } else if (!showMoreButton) {
        filterItems.forEach((item: any, index: number) => {
          if (index >= 5) item.style.display = 'none';
        });

        if (initialfilterPanel) {
          initialfilterPanel.style.overflow = 'hidden';
          if (!filterPanel.querySelector('.show-more-button')) {
            initialfilterPanel.style.height = '100px !important';
          } else {
            initialfilterPanel.style.height = 'auto';
          }
        }

        const showMoreButton = document.createElement('div');
        showMoreButton.classList.add('show-more-button');
        showMoreButton.innerText = 'Show More';
        showMoreButton.style.marginTop = '105px';
        showMoreButton.onclick = () => this.toggleShowMore(filterPanel);

        // filterPanel.appendChild(showMoreButton);
                filterPanel.querySelector('.ag-virtual-list-container').appendChild(showMoreButton);

        this.filtersWithMoreThanFiveItems.add(filterPanel.id);
      }
    }
  }

  private toggleShowMore(filterPanel: any) {
    const filterItems = filterPanel.querySelectorAll('.ag-virtual-list-item.ag-filter-virtual-list-item');
    const showMoreButton = filterPanel.querySelector('.show-more-button');

    if (!showMoreButton) return;

    filterItems.forEach((item: any) => {
      item.style.display = 'block';
    });

    const filterList = filterPanel.querySelector('.ag-set-filter-list');
    if (filterList) {
      filterList.style.height = 'auto';
    }

    this.showMoreClicked.add(filterPanel.id);
    showMoreButton.remove();
  }

  collapseAll() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.filtersWithMoreThanFiveItems.clear();
    this.showMoreClicked.clear();
    this.manuallyExpandedFilters.clear();
    this.eventListenersAdded = false;
    window.removeEventListener('resize', this.adjustModalHeight);
    // Remove event listeners when closing modal
    // const filterPanels = document.querySelectorAll('.ag-filter-toolpanel-group-wrapper');
    // filterPanels.forEach((filterPanel: any) => {
    //   const filterHeader = filterPanel.querySelector('.ag-filter-toolpanel-header');
    //   if (filterHeader && filterHeader.hasAttribute('data-listener-added')) {
    //     filterHeader.removeAttribute('data-listener-added');
    //   }
    // });
  }

  adjustModalHeight() {
    const browserBottom = window.innerHeight; // Height of the browser window
    const modalContainer = document.querySelector('.mat-dialog-container'); // Assuming this is the modal container
    if (modalContainer) {
      // Set the max-height to be based on the available space
      const headerHeight = 50; // You can adjust the header and footer height if needed
      const footerHeight = 60; // Update this based on the actual height of your footer
      const availableHeight = browserBottom - headerHeight - footerHeight;
      
      modalContainer.setAttribute('style', `maxHeight: ${availableHeight}px`); // Dynamically set the max-height
    }
  }

  private showSpinner(filterPanel: any) {
    let existingSpinner = filterPanel.querySelector('.filter-spinner');
    if (!existingSpinner) {
      const spinner = document.createElement('div');
      spinner.classList.add('filter-spinner');
      filterPanel.appendChild(spinner);
    }
  }
  
  // Hide spinner from the specific filter panel
  private hideSpinner(filterPanel: any) {
    const spinner = filterPanel.querySelector('.filter-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  // Listen for window resize to dynamically adjust the height
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustModalHeight();
  }
}
