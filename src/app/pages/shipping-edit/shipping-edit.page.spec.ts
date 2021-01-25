import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingEditPage } from './shipping-edit.page';

describe('ShippingEditPage', () => {
  let component: ShippingEditPage;
  let fixture: ComponentFixture<ShippingEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
