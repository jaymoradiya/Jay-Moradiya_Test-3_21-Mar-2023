import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment.development';
import { Program } from '../models/program.model';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  Api = environment.Api;
  programs = new BehaviorSubject<Program[]>([]);
  error = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  getAllPrograms(): Observable<ApiResponse<Program[]>> {
    return this.http.get<ApiResponse<Program[]>>(this.Api.GetAllPrograms).pipe(
      map((res) => {
        if (res.success) {
          this.programs.next(res.programs);
          this.error.next(null);
        } else {
          this.handleError(res);
        }
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        this.handleError(err.error);
        throw err;
      })
    );
  }

  createProgram(program: Program): Observable<ApiResponse<Program[]>> {
    const formData = new FormData();
    Object.keys(program).forEach((key) =>
      formData.append(key, (program as any)[key])
    );
    return this.http
      .post<ApiResponse<Program[]>>(this.Api.CreateProgram, formData)
      .pipe(
        map((res) => {
          if (res.success) {
            this.programs.next([...this.programs.getValue(), program]);
            this.error.next(null);
          } else {
            this.handleError(res);
          }
          return res;
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err.error);
          throw err;
        })
      );
  }

  updateProgram(program: Program): Observable<ApiResponse<Program[]>> {
    const formData = new FormData();
    Object.keys(program).forEach((key) =>
      formData.append(key, (program as any)[key])
    );
    return this.http
      .put<ApiResponse<Program[]>>(this.Api.EditProgram, formData)
      .pipe(
        map((res) => {
          if (res.success) {
            this.programs.next(
              this.programs.getValue().reduce((acc: Program[], crr) => {
                if (crr.programID === program.programID) {
                  crr = program;
                }
                acc.push(crr);
                return acc;
              }, [])
            );
            this.error.next(null);
          } else {
            this.handleError(res);
          }
          return res;
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err.error);
          throw err;
        })
      );
  }

  activateProgram(programId: string): Observable<ApiResponse<Program[]>> {
    const formData = new FormData();
    formData.append('programID', programId);
    return this.http
      .put<ApiResponse<Program[]>>(
        `${this.Api.ActivateDeactivateProgram}/${programId}/activate`,
        formData
      )
      .pipe(
        map((res) => {
          if (res.success) {
            const updatePrograms = this.programs
              .getValue()
              .reduce((acc: Program[], crr) => {
                if (crr.programID === programId) {
                  crr.isActive = true;
                }
                acc.push(crr);
                return acc;
              }, []);
            this.programs.next(updatePrograms);
            res.programs = updatePrograms;
            this.error.next(null);
          } else {
            this.handleError(res);
          }
          return res;
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err.error);
          throw err;
        })
      );
  }
  deactivateProgram(programId: string): Observable<ApiResponse<Program[]>> {
    return this.http
      .delete<ApiResponse<Program[]>>(
        `${this.Api.ActivateDeactivateProgram}/${programId}`
      )
      .pipe(
        map((res) => {
          if (res.success) {
            const updatePrograms = this.programs
              .getValue()
              .reduce((acc: Program[], crr) => {
                if (crr.programID === programId) {
                  crr.isActive = false;
                }
                acc.push(crr);
                return acc;
              }, []);
            this.programs.next(updatePrograms);
            res.programs = updatePrograms;
            this.error.next(null);
          } else {
            this.handleError(res);
          }
          return res;
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err.error);
          throw err;
        })
      );
  }

  handleError(res: any) {
    this.error.next(res.message);
  }
}
