/* shared service class to eliminate the farmers email from the url 
   used as a middle-man between the farmers-list and farmers-profile components
*/

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    private userEmail!: string;

    setUserEmail(email: string) {
        this.userEmail = email;
    }

    getUserEmail(): string {
        return this.userEmail;
    }
}