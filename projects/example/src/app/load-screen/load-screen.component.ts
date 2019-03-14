import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const validKeySizes: number[] = [
  1541,
  15401,
  140141,
  1262801,
  11366741
];

@Component({
  selector: 'sudoku-load-screen',
  templateUrl: './load-screen.component.html',
  styleUrls: ['./load-screen.component.scss']
})
export class LoadScreenComponent implements OnInit {
  @ViewChild('content') content: any;
  errorMessage: string = '';
  key: string = '';
  @Output() loadSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  exitLoad() {
    this.loadSelected.emit(null);
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  loadGame() {
    const loadKey = this.key.trim().replace(/(\r\n|\n|\r)/gm, '').trim();
    const loadKeyLength = loadKey.length;
    if (!validKeySizes.some(vKeySize => vKeySize === loadKeyLength)) {
      this.errorMessage = 'The key you entered is of an invalid length';
      this.modalService.open(this.content, {
        centered: true,
        size: 'lg',
      }).result.then(() => {}, reason => {});
    } else if (loadKey.match('.*[a-zA-Y]+.*')) {
      this.errorMessage = 'The key you entered constains invalid characters';
      this.modalService.open(this.content, {
        centered: true,
        size: 'lg',
      }).result.then(() => {}, reason => {});
    } else {
      this.loadSelected.emit(loadKey);
    }
  }
}
