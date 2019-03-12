import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sudoku-load-screen',
  templateUrl: './load-screen.component.html',
  styleUrls: ['./load-screen.component.scss']
})
export class LoadScreenComponent implements OnInit {
  key: string = '';
  @Output() loadSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  exitLoad() {
    this.loadSelected.emit(null);
  }

  loadGame() {
    this.loadSelected.emit(this.key);
  }
}
