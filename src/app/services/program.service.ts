import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment.development';
import { Program } from '../models/program.model';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  API = environment.API;
  programs = new BehaviorSubject<Program[]>([]);
  error = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  getAllPrograms(): Observable<ApiResponse<Program[]>> {
    return this.http
      .get<ApiResponse<Program[]>>(this.API.GET_ALL_PROGRAMS)
      .pipe(
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
      .post<ApiResponse<Program[]>>(this.API.CREATE_PROGRAM, formData)
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
      .put<ApiResponse<Program[]>>(this.API.EDIT_PROGRAM, formData)
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
        `${this.API.ACTIVATE_DEACTIVATE_PROGRAM}/${programId}/activate`,
        formData
      )
      .pipe(
        map((res) => {
          if (res.success) {
            this.programs.next(
              this.programs.getValue().reduce((acc: Program[], crr) => {
                if (crr.programID === programId) {
                  crr.isActive = true;
                  res.programs = [crr];
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
  deactivateProgram(programId: string): Observable<ApiResponse<Program[]>> {
    return this.http
      .delete<ApiResponse<Program[]>>(
        `${this.API.ACTIVATE_DEACTIVATE_PROGRAM}/${programId}`
      )
      .pipe(
        map((res) => {
          if (res.success) {
            this.programs.next(
              this.programs.getValue().reduce((acc: Program[], crr) => {
                if (crr.programID === programId) {
                  crr.isActive = false;
                  res.programs = [crr];
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

  handleError(res: any) {
    this.error.next(res.message);
  }
}