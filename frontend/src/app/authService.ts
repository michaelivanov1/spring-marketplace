import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateEmail } from "@app/validators/email.validator";
import { ValidatePassword } from "@app/validators/password.validator";
import jwt_decode from "jwt-decode";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loginForm: FormGroup;
    email: FormControl;
    password: FormControl;
    decodedToken: any;
    hidePassword = true;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ) {
        this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail]));
        this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword]));

        this.loginForm = this.formBuilder.group({
            email: this.email,
            password: this.password
        });
    }

    register(displayName: string, email: string, password: string): Observable<any> {
        return this.http.post<any>('http://localhost:8080/api/auth/register', { displayName, email, password }, {
            responseType: 'json',
        }).pipe(
            tap((response: any) => {
                console.log('non decoded token: ' + response.token);
                localStorage.setItem('jwtToken', response.token);
                this.decodedToken = jwt_decode(response.token);
                let loginEmail = this.decodedToken.sub;
                console.log(`decoded email: ` + loginEmail);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<any>('http://localhost:8080/api/auth/authenticate', { email, password }).pipe(
            tap((response: any) => {
                console.log('non decoded token: ' + response.token);
                localStorage.setItem('jwtToken', response.token);
                this.decodedToken = jwt_decode(response.token);
                let loginEmail = this.decodedToken.sub;
                console.log(`decoded email: ` + loginEmail);
            })
        );
    }

    logout() {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    }
}