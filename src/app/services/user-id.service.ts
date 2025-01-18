import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserIdService {
    id:string = '';
    isServer: boolean = true;
}