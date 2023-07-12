import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BASEURL } from '@app/constants';
@Injectable({
  providedIn: 'root',
})
export class GenericHttpService<T> {
  // can't inject primitives, so use the @Inject decorator on url
  constructor(
    private httpClient: HttpClient,
    @Inject(String) private entity: string
  ) { } // constructor
  public add(item: T): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .post<T>(`${BASEURL}${this.entity}`, item, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // add

  update<T>(email: string, item: T): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .put<T>(`${BASEURL}${this.entity}/${email}`, item, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // update

  updateUserStand<T>(item: T): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .put<T>(`${BASEURL}${this.entity}`, item, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // update

  public get(): Observable<T[]> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .get<T[]>(`${BASEURL}${this.entity}`, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // getAll

  public getSome(id: any): Observable<T[]> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .get<T[]>(`${BASEURL}${this.entity}/${id}`, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // getSome

  public getOne(id: any): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .get<T>(`${BASEURL}${this.entity}/${id}`, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // getOne

  public delete(email: any): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .delete<T>(`${BASEURL}${this.entity}/${email}`, { headers })
      .pipe(retry(2), catchError(this.handleError));
  } // delete

  // Error handling
  handleError(error: any) {
    let status: any;
    error.error instanceof ErrorEvent
      ? // Get client-side error
      (status = error.error.message)
      : // Get server-side error
      (status = `Error Code: ${error.status}\nMessage: ${error.message}`);
    window.alert(status);
    return throwError(() => status);
  }
} // GenericHttpService
