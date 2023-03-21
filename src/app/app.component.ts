import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditProgramComponent } from './components/create-edit-program/create-edit-program.component';
import { ProgramService } from './services/program.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Jay Moradiya Test-3';

  error: string | null = 'null';
  constructor(
    public dialog: MatDialog,
    private programService: ProgramService
  ) {
    this.programService.error.subscribe((err) => {
      this.error = err;
    });
  }

  openDialog() {
    if (this.dialog.openDialogs.length == 0) {
      this.dialog.open(CreateEditProgramComponent, {
        width: '400px',
        restoreFocus: true,
      });
    }
  }
}
