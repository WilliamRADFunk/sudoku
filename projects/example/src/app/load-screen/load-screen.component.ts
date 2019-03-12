import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sudoku-load-screen',
  templateUrl: './load-screen.component.html',
  styleUrls: ['./load-screen.component.scss']
})
export class LoadScreenComponent implements OnInit {
  @Output() loadSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  exitLoad() {
    this.loadSelected.emit(false);
  }
}
