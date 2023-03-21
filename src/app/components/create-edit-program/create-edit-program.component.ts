import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Program } from 'src/app/models/program.model';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-create-edit-program',
  templateUrl: './create-edit-program.component.html',
})
export class CreateEditProgramComponent {
  public targetElement: HTMLElement | null = null;
  @Input()
  isEditMode = false;

  @Input()
  program: Program = {
    programID: '',
    programNumber: '',
    programName: '',
    programDescription: '',
    isActive: true,
    programBudget: 0,
    isVirtual: false,
    canDelete: false,
  };

  constructor(
    private programService: ProgramService,
    public dialogRef: MatDialogRef<CreateEditProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Program | undefined
  ) {
    if (data) {
      this.program = data;
      this.isEditMode = true;
    }
  }

  onSave() {
    let programObservable;
    if (this.isEditMode) {
      programObservable = this.programService.updateProgram(this.program!);
    } else {
      programObservable = this.programService.createProgram(this.program!);
    }
    programObservable.subscribe();
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
