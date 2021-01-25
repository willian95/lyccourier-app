import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingCreatePage } from './shipping-create.page';

describe('ShippingCreatePage', () => {
  let component: ShippingCreatePage;
  let fixture: ComponentFixture<ShippingCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
