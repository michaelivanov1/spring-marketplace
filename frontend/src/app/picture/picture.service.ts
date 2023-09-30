import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Picture } from '@app/picture/picture';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})

export class PictureService extends GenericHttpService<Picture> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `file`);
  } // constructor
} // PictureService
