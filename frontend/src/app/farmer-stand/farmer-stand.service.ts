import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FarmerStand } from '@app/farmer-stand/farmer-stand';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class FarmerStandService extends GenericHttpService<FarmerStand> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `farmer_stand`);
  } // constructor
} // FarmerStandService
