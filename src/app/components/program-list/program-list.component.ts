import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Program } from 'src/app/models/program.model';
import { ProgramService } from 'src/app/services/program.service';
import { CreateEditProgramComponent } from '../create-edit-program/create-edit-program.component';
import { GridComponent, printGridInit } from '@syncfusion/ej2-angular-grids';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css'],
})
export class ProgramListComponent implements OnInit {
  programs: Program[] = [];
  isImmutable = true;
  @ViewChild('grid') grid: GridComponent | null = null;

  constructor(
    private programService: ProgramService,
    private dialog: MatDialog
  ) {
    programService.programs.subscribe((programs) => {
      // Normal Method
      // this.programs = programs;

      /// More efficient way
      this.grid?.setProperties({
        dataSource: programs,
      });
    });
  }

  ngOnInit(): void {
    this.programService.getAllPrograms().subscribe();
  }

  onStatusChange(program: Program) {
    let programObservable: Observable<ApiResponse<Program[]>>;
    if (program.isActive) {
      programObservable = this.programService.deactivateProgram(
        program.programID
      );
    } else {
      programObservable = this.programService.activateProgram(
        program.programID
      );
    }
    programObservable.subscribe((res) => {
      // var index = this.grid!.selectedRowIndex;
      // this.grid!.updateRow(index, res.programs[0]);
      // console.log(res.programs[0]);
    });
  }

  onEdit(program: Program) {
    this.dialog.open(CreateEditProgramComponent, {
      width: '400px',
      data: program,
    });
  }

  actionComplete(data: any) {}
}
