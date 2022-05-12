import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelector } from './store.selector';

describe('StoreSelectorComponent', () => {
  let component: StoreSelector;
  let fixture: ComponentFixture<StoreSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSelector ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
