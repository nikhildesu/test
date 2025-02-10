import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { TreeChecklistExample } from './tree-checklist-example';
import { MatButtonModule } from '@angular/material/button';

interface InvestmentNode {
  name: string;
  count: number;
  selected?: boolean;
  children?: InvestmentNode[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  imports: [
    FormsModule,
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  standalone: true,
})
export class ModalComponent {
  constructor(public dialog: MatDialog) {}

  openModal() {
    const treeData = [
      { name: 'Tree 1', nodes: [
        { name: 'Category A', children: [{ name: 'Item A1' }, { name: 'Item A2' }, { name: 'Item A3' }] },
        { name: 'Category B', children: [{ name: 'Item B1' }, { name: 'Item B2' }, { name: 'Item B3' }] }
      ]},
      { name: 'Tree 2', nodes: [
        { name: 'Category X', children: [{ name: 'Item X1' }, { name: 'Item X2' }, { name: 'Item X3' }] },
        { name: 'Category Y', children: [{ name: 'Item Y1' }, { name: 'Item Y2' }, { name: 'Item Y3' }] }
      ]},
      { name: 'Tree 3', nodes: [
        { name: 'Category M', children: [{ name: 'Item M1' }, { name: 'Item M2' }, { name: 'Item M3' }] },
        { name: 'Category N', children: [{ name: 'Item N1' }, { name: 'Item N2' }, { name: 'Item N3' }] }
      ]}
    ];

    const dialogRef = this.dialog.open(TreeChecklistExample, {
      width: '600px',
      data: { trees: treeData },
      disableClose: false, // Allow closing on backdrop click
    });

    // Handle closure of the dialog
    dialogRef.afterClosed().subscribe(selectedItems => {
      if (selectedItems) {
        console.log('User selected:', selectedItems);
      } else {
        console.log('Dialog closed without selection.');
      }
    });

    // Track clicking outside (backdrop click)
    dialogRef.backdropClick().subscribe(() => {
      console.log('Backdrop clicked (dialog closed)');
    });
  }
}
