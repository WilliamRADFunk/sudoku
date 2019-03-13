import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadScreenComponent } from './load-screen.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

describe('LoadScreenComponent', () => {
  let component: LoadScreenComponent;
  let fixture: ComponentFixture<LoadScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgbModule
      ],
      declarations: [ LoadScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadScreenComponent);
    component = fixture.componentInstance;
    component.content = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
