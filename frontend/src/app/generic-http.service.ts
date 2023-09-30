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

  public upload(item: T): Observable<T> {
    console.log('inside');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
    return this.httpClient.post<T>(`${BASEURL}${this.entity}`, item, {
      headers,
    });
    //.pipe(retry(2), catchError(this.handleError));
  } // upload

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
      .put<T>(`${BASEURL}${this.entity}/edit`, item, { headers })
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

  deleteProduceItem<T>(email: string, foodName: string): Observable<boolean> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .delete<boolean>(
        `${BASEURL}${this.entity}/${email}/produce/${foodName}`,
        { headers }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  public patchSingleField<T>(
    field: any,
    value: any,
    email: any
  ): Observable<T> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      .set('Content-Type', 'application/json');
    return this.httpClient
      .patch<T>(`${BASEURL}${this.entity}/${email}`, `"${field}": "${value}"`, {
        headers,
      })
      .pipe(retry(2), catchError(this.handleError));
  }

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
