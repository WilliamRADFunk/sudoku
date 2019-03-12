import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import 'rxjs';
import * as fileSaver from 'file-saver';

import { BoardOverlordService } from 'sudoku';

@Component({
  selector: 'sudoku-save-screen',
  templateUrl: './save-screen.component.html',
  styleUrls: ['./save-screen.component.scss']
})
export class SaveScreenComponent implements OnInit {
  isLoading: boolean = false;
  key: string = '';
  @Output() saveSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly boardOverlordService: BoardOverlordService) { }

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.key = this.boardOverlordService.getSaveGameKey();
      this.isLoading = false;
    }, 200);
  }

  copyToClipboard() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', this.key);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  download() {
    const blob = new Blob([this.key], {type: 'text'});
    const filename = 'sudoku-save-key.txt';
    fileSaver.saveAs(blob, filename);
  }

  exitSave() {
    this.saveSelected.emit(false);
  }
}
