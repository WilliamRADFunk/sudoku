import { Injectable } from '@angular/core';
import { Cell } from '../models/cell';
import { Board } from '../models/board';

@Injectable({
    providedIn: 'root'
})
export class BoardOverlordService {
    private boardsByLevel: Board[] = [];
    public readonly numOfLevels: number = 2;

    constructor() { }
}
