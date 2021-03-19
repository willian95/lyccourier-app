import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingsPage } from './shippings.page';

describe('ShippingsPage', () => {
  let component: ShippingsPage;
  let fixture: ComponentFixture<ShippingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
