import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientAddPage } from './client-add.page';

describe('ClientAddPage', () => {
  let component: ClientAddPage;
  let fixture: ComponentFixture<ClientAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
