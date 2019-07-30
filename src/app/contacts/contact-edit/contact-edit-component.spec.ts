import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';

import {Contact, ContactService, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent } from '../shared';
import { AppMaterialModule } from '../../app.material.module';
import { ContactEditComponent } from './contact-edit.component';

import '../../../material-app-theme.scss';


describe('ContactEditComponent tests', () => {
    let fixture: ComponentFixture<ContactEditComponent>;
    let component: ContactEditComponent;
    let rootElement: DebugElement;

    const contactServiceStub = {
        contact: {id: 1, name: 'Farooq' },

        save: async function(contact: Contact) {
            component.contact = contact;
        },

        getContact: async function(id: number) {
            component.contact = this.contact;
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContactEditComponent,
                FavoriteIconDirective,
                InvalidEmailModalComponent,
                InvalidPhoneNumberModalComponent
            ],
            imports: [
                AppMaterialModule,
                FormsModule,
                RouterTestingModule,
                NoopAnimationsModule
            ],
            providers: [{
                provide: ContactService, useValue: contactServiceStub
            }]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    InvalidEmailModalComponent,
                    InvalidPhoneNumberModalComponent
                ]
            }
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        rootElement = fixture.debugElement;
    });

    describe('saveContact() test', () => {
        it('should display contact name after contact set', fakeAsync(() => {
            const contact = { id: 1, name: 'Bubba' };

            component.isLoading = false;
            component.saveContact(contact);
            fixture.detectChanges();

            const nameInput = rootElement.query(By.css('.contact-name'));
            tick();

            expect(nameInput.nativeElement.value).toBe('Bubba');
        }));
    });

    describe('loadContact() test', () => {
        it('should load contact', fakeAsync(() => {
            component.isLoading = false;
            component.loadContact();
            fixture.detectChanges();

            const nameInput = rootElement.query(By.css('.contact-name'));
            tick();

            expect(nameInput.nativeElement.value).toBe('Farooq');
        }));
    });

    describe('updateContact() test', () => {
        it('should update the contact', fakeAsync(() => {

            component.contact = contactServiceStub.contact;
            component.isLoading = false;
            fixture.detectChanges();

            const nameInput = rootElement.query(By.css('.contact-name'));
            tick();
            expect(nameInput.nativeElement.value).toBe('Farooq');

            const newContact = {id: 2, name: 'Bubba', email: '', number: '' };
            component.updateContact(newContact);
            fixture.detectChanges();
            tick(100);
            expect(nameInput.nativeElement.value).toBe('Bubba');
        }));

        it('should not update the contact when the email is invalid', fakeAsync(() => {

            component.contact = contactServiceStub.contact;
            component.isLoading = false;
            fixture.detectChanges();

            const nameInput = rootElement.query(By.css('.contact-name'));
            tick();
            expect(nameInput.nativeElement.value).toBe('Farooq');

            const newContact = {id: 2, name: 'Bubba', email: 'bubba@', number: '' };
            component.updateContact(newContact);
            fixture.detectChanges();
            tick(100);
            expect(nameInput.nativeElement.value).toBe('Farooq');
        }));

        it('should not update the contact when the phone number is invalid', fakeAsync(() => {

            component.contact = contactServiceStub.contact;
            component.isLoading = false;
            fixture.detectChanges();

            const nameInput = rootElement.query(By.css('.contact-name'));
            tick();
            expect(nameInput.nativeElement.value).toBe('Farooq');

            const newContact = {id: 2, name: 'Bubba', email: '', number: '123' };
            component.updateContact(newContact);
            fixture.detectChanges();
            tick(100);
            expect(nameInput.nativeElement.value).toBe('Farooq');
        }));
    });

    
});
