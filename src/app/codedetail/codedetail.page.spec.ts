import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodedetailPage } from './codedetail.page';

describe('CodedetailPage', () => {
  let component: CodedetailPage;
  let fixture: ComponentFixture<CodedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodedetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
