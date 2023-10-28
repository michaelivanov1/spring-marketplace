/* shared service class to eliminate the farmers email from the url 
   used as a middle-man between the farmers-list and farmers-profile components

   sessionStorage is used so the email will persist when user refreshes while viewing a farmers profile
*/

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    private userEmailKey = 'userEmail';

    setUserEmail(email: string) {
        sessionStorage.setItem(this.userEmailKey, email);
    }

    getUserEmail(): string | null {
        return sessionStorage.getItem(this.userEmailKey);
    }
}