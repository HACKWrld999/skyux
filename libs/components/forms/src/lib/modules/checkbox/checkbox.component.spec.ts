import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DebugElement,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import {
  FormsModule,
  NgForm,
  NgModel,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService, SkyLogService } from '@skyux/core';

import { sampleTime } from 'rxjs/operators';

import { SkyCheckboxChange } from './checkbox-change';
import { SkyCheckboxComponent } from './checkbox.component';
import { SkyCheckboxModule } from './checkbox.module';

// #region helpers
/** Simple component for testing a single checkbox. */
@Component({
  template: ` <div>
    <sky-checkbox
      [checkboxType]="checkboxType"
      [checked]="isChecked"
      [disabled]="isDisabled"
      [icon]="icon"
      [id]="id"
      [(indeterminate)]="indeterminate"
      (change)="checkboxChange($event)"
    >
      <sky-checkbox-label>
        Simple checkbox
        <span *ngIf="showInlineHelp">Help inline</span>
      </sky-checkbox-label>
    </sky-checkbox>
  </div>`,
})
class SingleCheckboxComponent implements AfterViewInit {
  public checkboxType: string | undefined;
  public icon = 'bold';
  public id: string | undefined = 'simple-check';
  public indeterminate = false;
  public isChecked: boolean | undefined = false;
  public isDisabled = false;
  public showInlineHelp = false;

  @ViewChild(SkyCheckboxComponent)
  public checkboxComponent: SkyCheckboxComponent | undefined;

  public ngAfterViewInit() {
    this.checkboxComponent?.disabledChange.subscribe((value) => {
      this.onDisabledChange(value);
    });
  }

  public onDisabledChange(value: boolean): void {}

  public checkboxChange($event: SkyCheckboxChange) {
    this.isChecked = $event.checked;
  }
}

/** Simple component for testing an MdCheckbox with ngModel. */
@Component({
  template: `
    <div>
      <form>
        <sky-checkbox name="cb" [(ngModel)]="isGood" #wut>
          <sky-checkbox-label> Be good </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithFormDirectivesComponent {
  public isGood = false;
}

/** Simple component for testing a required template-driven checkbox. */
@Component({
  template: `
    <div>
      <form>
        <sky-checkbox name="cb" ngModel [required]="required">
          <sky-checkbox-label>
            Be good
            <span *ngIf="showInlineHelp">Help inline</span>
          </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithRequiredInputComponent {
  public required = true;
  public showInlineHelp = false;
}

/** Simple component for testing a required template-driven checkbox. */
@Component({
  template: `
    <div>
      <form>
        <sky-checkbox name="cb" ngModel required>
          <sky-checkbox-label>
            Be good
            <span *ngIf="showInlineHelp">Help inline</span>
          </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithRequiredAttributeComponent {
  public showInlineHelp = false;
}

/** Simple component for testing an MdCheckbox with ngModel. */
@Component({
  template: `
    <div>
      <form [formGroup]="checkboxForm">
        <sky-checkbox name="cb" formControlName="checkbox1" #wut>
          <sky-checkbox-label> Be good </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithReactiveFormComponent {
  public checkbox1: UntypedFormControl = new UntypedFormControl(false);
  public checkboxForm = new UntypedFormGroup({ checkbox1: this.checkbox1 });
}

/** Simple component for testing a reactive form checkbox with required validator. */
@Component({
  template: `
    <div>
      <form [formGroup]="checkboxForm">
        <sky-checkbox
          name="cb"
          formControlName="checkbox1"
          [required]="required"
          #wut
        >
          <sky-checkbox-label> Be good </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithReactiveFormRequiredInputComponent {
  public checkbox1: UntypedFormControl = new UntypedFormControl(false);
  public checkboxForm = new UntypedFormGroup({ checkbox1: this.checkbox1 });
  public required = true;
}

/** Simple component for testing a reactive form checkbox with required validator. */
@Component({
  template: `
    <div>
      <form [formGroup]="checkboxForm">
        <sky-checkbox name="cb" formControlName="checkbox1" #wut>
          <sky-checkbox-label> Be good </sky-checkbox-label>
        </sky-checkbox>
      </form>
    </div>
  `,
})
class CheckboxWithReactiveFormRequiredValidatorComponent {
  public checkbox1: UntypedFormControl = new UntypedFormControl(
    false,
    Validators.requiredTrue
  );
  public checkboxForm = new UntypedFormGroup({ checkbox1: this.checkbox1 });
}

/** Simple test component with multiple checkboxes. */
@Component({
  template: `
    <sky-checkbox>
      <sky-checkbox-label> Option 1 </sky-checkbox-label>
    </sky-checkbox>
    <sky-checkbox>Option 2</sky-checkbox>
  `,
})
class MultipleCheckboxesComponent {}

/** Simple test component with tabIndex */
@Component({
  template: ` <sky-checkbox [tabindex]="customTabIndex" [disabled]="isDisabled">
  </sky-checkbox>`,
})
class CheckboxWithTabIndexComponent {
  public customTabIndex = 7;
  public isDisabled = false;
}

/** Simple test component with an aria-label set. */
@Component({
  template: `<sky-checkbox label="Super effective"></sky-checkbox>`,
})
class CheckboxWithAriaLabelComponent {}

/** Simple test component with an aria-label set. */
@Component({
  template: `<sky-checkbox labelledBy="some-id"></sky-checkbox>`,
})
class CheckboxWithAriaLabelledbyComponent {}

/** Simple test component with name attribute */
@Component({
  template: `<sky-checkbox [name]="name"></sky-checkbox>`,
})
class CheckboxWithNameAttributeComponent {
  public name = 'test-name';
}

/** Simple test component with change event */
@Component({
  template: `<sky-checkbox
    id="test-id"
    (change)="lastEvent = $event"
  ></sky-checkbox>`,
})
class CheckboxWithChangeEventComponent {
  public lastEvent: SkyCheckboxChange | undefined;
}

/** Simple test component with OnPush change detection */
@Component({
  template: ` <div>
    <sky-checkbox id="simple-check" [(ngModel)]="isChecked"> </sky-checkbox>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CheckboxWithOnPushChangeDetectionComponent {
  public isChecked = false;
  constructor(public ref: ChangeDetectorRef) {}
}
// #endregion

describe('Checkbox component', () => {
  let fixture: ComponentFixture<any>;

  function createEvent(eventName: string) {
    const evt = document.createEvent('CustomEvent');
    evt.initEvent(eventName, false, false);
    return evt;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxWithAriaLabelComponent,
        CheckboxWithAriaLabelledbyComponent,
        CheckboxWithChangeEventComponent,
        CheckboxWithFormDirectivesComponent,
        CheckboxWithNameAttributeComponent,
        CheckboxWithOnPushChangeDetectionComponent,
        CheckboxWithTabIndexComponent,
        CheckboxWithReactiveFormComponent,
        CheckboxWithReactiveFormRequiredInputComponent,
        CheckboxWithReactiveFormRequiredValidatorComponent,
        CheckboxWithRequiredAttributeComponent,
        CheckboxWithRequiredInputComponent,
        MultipleCheckboxesComponent,
        SingleCheckboxComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
      providers: [NgForm],
    });

    // Mock the ID service.
    let uniqueId = 0;
    const idSvc = TestBed.inject(SkyIdService);
    spyOn(idSvc, 'generateId').and.callFake(() => `MOCK_ID_${++uniqueId}`);
  });

  describe('basic behaviors', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement | null;
    let checkboxInstance: SkyCheckboxComponent;
    let testComponent: SingleCheckboxComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SingleCheckboxComponent);

      await fixture.whenStable();
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = checkboxNativeElement?.querySelector('input');
      labelElement = checkboxNativeElement?.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should emit the new disabled value when it is modified', fakeAsync(() => {
      const onDisabledChangeSpy = spyOn(testComponent, 'onDisabledChange');
      expect(onDisabledChangeSpy).toHaveBeenCalledTimes(0);
      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(onDisabledChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it('should add and remove the checked state', () => {
      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement?.checked).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(inputElement?.checked).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement?.checked).toBe(false);
    });

    it('should toggle checked state on click', async () => {
      fixture.detectChanges();
      expect(checkboxInstance.checked).toBe(false);
      expect(testComponent.isChecked).toBe(false);

      labelElement?.click();

      await fixture.whenStable();
      fixture.detectChanges();
      expect(checkboxInstance.checked).toBe(true);
      expect(testComponent.isChecked).toBe(true);

      labelElement?.click();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(testComponent.isChecked).toBe(false);
    });

    it('should add and remove disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);
      expect(inputElement?.tabIndex).toBe(0);
      expect(inputElement?.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(inputElement?.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(inputElement?.tabIndex).toBe(0);
      expect(inputElement?.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interaction while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      inputElement?.dispatchEvent(createEvent('change'));
      fixture.detectChanges();
      expect(checkboxInstance.checked).toBe(false);
      labelElement?.click();
      expect(checkboxInstance.checked).toBe(false);
    });

    it('should handle the indeterminate state not being set', () => {
      fixture.detectChanges();

      expect(inputElement?.indeterminate).toBeFalse();
    });

    it('should handle the indeterminate state being set', () => {
      testComponent.indeterminate = true;
      fixture.detectChanges();

      expect(inputElement?.indeterminate).toBeTrue();
    });

    it('should turn off the indeterminate state if the checkbox is clicked after it is set', () => {
      testComponent.indeterminate = true;
      fixture.detectChanges();

      expect(inputElement?.checked).toBeFalse();
      expect(inputElement?.indeterminate).toBeTrue();
      inputElement?.click();
      fixture.detectChanges();

      expect(inputElement?.checked).toBeTrue();
      expect(inputElement?.indeterminate).toBeFalse();
      expect(testComponent.indeterminate).toBeFalse();
    });

    it('should handle a user-provided id', () => {
      fixture.detectChanges();
      expect(inputElement?.id).toBe('sky-checkbox-simple-check-input');
    });

    it('should handle undefined being passed in as the id', () => {
      testComponent.id = undefined;
      fixture.detectChanges();
      expect(inputElement?.id).toEqual(
        jasmine.stringMatching(/sky-checkbox-MOCK_ID_[0-9]-input/)
      );
    });

    it('should project the checkbox content into the label element', () => {
      const label = checkboxNativeElement?.querySelector(
        '.sky-checkbox-wrapper sky-checkbox-label'
      );
      expect(label?.textContent?.trim()).toBe('Simple checkbox');
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement?.tabIndex).toBe(0);
    });

    it('should show inline help', () => {
      testComponent.showInlineHelp = true;
      fixture.detectChanges();
      const label: HTMLElement | null | undefined =
        checkboxNativeElement?.querySelector('sky-checkbox-label');
      expect(label?.innerText).toBe('Simple checkboxHelp inline'); // expect no additional space between label and help
    });

    it('should pass accessibility', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('with change event and no initial value', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement | null;
    let checkboxInstance: SkyCheckboxComponent;
    let testComponent: CheckboxWithChangeEventComponent;
    let inputElement: HTMLInputElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithChangeEventComponent);

      fixture.detectChanges();

      await fixture.whenStable();
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');
    });

    it('should call not call the change event when the checkbox is not interacted with', async () => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      checkboxInstance.checked = true;
      fixture.detectChanges();

      await fixture.whenStable();
      expect(testComponent.lastEvent).toBeUndefined();
    });

    it('should call the change event and not emit a DOM event to the change output', async () => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      // Trigger the click on the inputElement, because the input will probably
      // emit a DOM event to the change output.
      inputElement?.click();
      fixture.detectChanges();

      await fixture.whenStable();
      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent?.checked).toBe(true);
    });
  });

  describe('with provided label attribute ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement | null;
    let inputElement: HTMLInputElement | null | undefined;

    it('should use the provided label as the input aria-label', async () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabelComponent);

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement?.querySelector('input');

      fixture.detectChanges();

      await fixture.whenStable();
      expect(inputElement?.getAttribute('aria-label')).toBe('Super effective');
    });
  });

  describe('with provided labelledBy attribute ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement | null;
    let inputElement: HTMLInputElement | null | undefined;

    it('should use the provided labeledBy as the input aria-labelledby', async () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabelledbyComponent);

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement?.querySelector('input');

      fixture.detectChanges();

      await fixture.whenStable();
      expect(inputElement?.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if no labeledBy is provided', async () => {
      fixture = TestBed.createComponent(SingleCheckboxComponent);

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;

      inputElement = checkboxNativeElement?.querySelector('input');

      fixture.detectChanges();

      await fixture.whenStable();
      expect(inputElement?.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('with provided tabIndex', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement | null;
    let testComponent: CheckboxWithTabIndexComponent;
    let inputElement: HTMLInputElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithTabIndexComponent);

      fixture.detectChanges();

      await fixture.whenStable();
      testComponent = fixture.debugElement.componentInstance;
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;

      inputElement = checkboxNativeElement?.querySelector('input');
    });

    it('should preserve any given tabIndex', async () => {
      expect(inputElement?.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(inputElement?.tabIndex).toBe(13);
    });
  });

  describe('with multiple checkboxes', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(MultipleCheckboxesComponent);

      fixture.detectChanges();
    });

    it('should assign a unique id to each checkbox', () => {
      const [firstId, secondId] = fixture.debugElement
        .queryAll(By.directive(SkyCheckboxComponent))
        .map(
          (debugElement) => debugElement.nativeElement.querySelector('input').id
        );

      expect(firstId).toBeTruthy();
      expect(secondId).toBeTruthy();
      expect(firstId).not.toEqual(secondId);
    });
  });

  describe('with ngModel and an initial value', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithFormDirectivesComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let ngModel: NgModel;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithFormDirectivesComponent);
      testComponent = fixture.debugElement.componentInstance;
      testComponent.isGood = true;
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;

      inputElement = checkboxNativeElement?.querySelector('input');

      ngModel = checkboxElement.injector.get(NgModel);
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should be in pristine, untouched, and valid states', async () => {
      fixture.detectChanges();
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.dirty).toBe(false);
      expect(ngModel.touched).toBe(false);
      expect(testComponent.isGood).toBe(true);

      labelElement?.click();

      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(false);
      expect(ngModel.dirty).toBe(true);
      expect(ngModel.touched).toBe(false);
      expect(testComponent.isGood).toBe(false);

      inputElement?.dispatchEvent(createEvent('blur'));
      expect(ngModel.touched).toBe(true);
    });
  });

  describe('with ngModel', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithFormDirectivesComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let ngModel: NgModel;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithFormDirectivesComponent);
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');

      ngModel = checkboxElement.injector.get(NgModel);
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should be in pristine, untouched, and valid states initially', async () => {
      fixture.detectChanges();
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.dirty).toBe(false);
      expect(ngModel.touched).toBe(false);

      labelElement?.click();

      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(false);
      expect(ngModel.dirty).toBe(true);
      expect(ngModel.touched).toBe(false);
      expect(testComponent.isGood).toBe(true);

      inputElement?.dispatchEvent(createEvent('blur'));
      expect(ngModel.touched).toBe(true);
    });

    it('should change check state through ngModel programmatically', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(false);
      expect(testComponent.isGood).toBe(false);
      fixture.detectChanges();
      testComponent.isGood = true;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(true);
    });

    it('should not have required and aria-required attributes when not required', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toBeNull();
    });

    it('should not have "sky-control-label-required" class', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(labelElement).not.toHaveCssClass('sky-control-label-required');
    });
  });

  describe('with ngModel and required input', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithRequiredInputComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let ngModel: NgModel;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithRequiredInputComponent);
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      testComponent = fixture.componentInstance;
      checkboxNativeElement = checkboxElement.nativeElement;

      inputElement = checkboxNativeElement?.querySelector('input');

      ngModel = checkboxElement.injector.get(NgModel);
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should have required and aria-required attributes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).not.toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toEqual('true');
    });

    it('should have "sky-control-label-required" class', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(labelElement).toHaveCssClass('sky-control-label-required');
    });

    it('should not have required and aria-required attributes when input is false', async () => {
      fixture.detectChanges();
      testComponent.required = false;
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).toBeNull();
      expect(inputElement?.getAttribute('aria-required')).not.toEqual('true');
    });

    it('should mark form as invalid when required input is true and checkbox is not checked', async () => {
      fixture.detectChanges();
      expect(ngModel.valid).toBe(false);
      labelElement?.click();
      expect(ngModel.valid).toBe(true);
      labelElement?.click();
      expect(ngModel.valid).toBe(false);
    });

    it('should not mark form as invalid when required input is false and checkbox is not checked', async () => {
      testComponent.required = false;
      fixture.detectChanges();
      expect(ngModel.valid).toBe(true);
      labelElement?.click();
      expect(ngModel.valid).toBe(true);
      labelElement?.click();
      expect(ngModel.valid).toBe(true);
    });
  });

  describe('with ngModel and required attribute', () => {
    let checkboxElement: DebugElement;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let ngModel: NgModel;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithRequiredAttributeComponent);
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;

      inputElement = checkboxNativeElement?.querySelector('input');

      ngModel = checkboxElement.injector.get(NgModel);
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should have required and aria-required attributes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).not.toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toEqual('true');
    });

    it('should mark form as invalid when required input is true and checkbox is not checked', async () => {
      fixture.detectChanges();
      expect(ngModel.valid).toBe(false);
      labelElement?.click();
      expect(ngModel.valid).toBe(true);
      labelElement?.click();
      expect(ngModel.valid).toBe(false);
    });
  });

  describe('with reactive form', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithReactiveFormComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let formControl: UntypedFormControl;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithReactiveFormComponent);
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');

      formControl = testComponent.checkbox1;
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should be in pristine, untouched, and valid states initially', async () => {
      fixture.detectChanges();
      expect(formControl.valid).toBe(true);
      expect(formControl.pristine).toBe(true);
      expect(formControl.dirty).toBe(false);
      expect(formControl.touched).toBe(false);

      labelElement?.click();

      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(formControl.valid).toBe(true);
      expect(formControl.pristine).toBe(false);
      expect(formControl.touched).toBe(false);
      expect(formControl.dirty).toBe(true);
      expect(formControl.value).toBe(true);

      inputElement?.dispatchEvent(createEvent('blur'));
      expect(formControl.touched).toBe(true);
    });

    it('should change check state through form control programmatically', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(false);
      expect(formControl.value).toBe(false);
      fixture.detectChanges();
      formControl.setValue(true);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(true);
    });

    it('should change disable state through form control programmatically', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.disabled).toBe(false);
      expect(formControl.value).toBe(false);
      fixture.detectChanges();
      formControl.disable();

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.disabled).toBe(true);
      expect(inputElement?.checked).toBe(false);

      formControl.enable();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.disabled).toBe(false);
      expect(inputElement?.checked).toBe(false);
    });

    it('should not have required and aria-required attributes when not required', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toBeNull();
    });

    it('should only emit the form control valueChanged event once per change', (done) => {
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const callback = function (): void {};
      const callbackSpy = jasmine.createSpy('callback', callback);

      formControl.valueChanges.subscribe(() => {
        callbackSpy();
      });

      // This will give us 10 milliseconds pause before emitting the final valueChanges event that
      // was fired. Testing was done to ensure this was enough time to catch any bad behavior
      const subscription = formControl.valueChanges
        .pipe(sampleTime(10))
        .subscribe(() => {
          expect(callbackSpy).toHaveBeenCalledTimes(1);
        });

      subscription.add(() => {
        done();
      });

      labelElement?.click();

      // Unsubscribe after 20 milliseconds so that the `add` callback will fire to end the test.
      // Tested to ensure this is enough time to catch this issue.
      setTimeout(() => {
        subscription.unsubscribe();
      }, 20);
    });
  });

  describe('with reactive form and required validator', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithReactiveFormRequiredValidatorComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let formControl: UntypedFormControl;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(
        CheckboxWithReactiveFormRequiredValidatorComponent
      );
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');

      formControl = testComponent.checkbox1;
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should have required and aria-required attributes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).not.toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toEqual('true');
    });

    it('should mark form as invalid when required checkbox is not checked', async () => {
      fixture.detectChanges();
      expect(formControl.valid).toBe(false);
      labelElement?.click();
      expect(formControl.valid).toBe(true);
      labelElement?.click();
      expect(formControl.valid).toBe(false);
    });
  });

  describe('with reactive form and required input', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithReactiveFormRequiredInputComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;
    let formControl: UntypedFormControl;
    let labelElement: HTMLLabelElement | null | undefined;

    beforeEach(async () => {
      fixture = TestBed.createComponent(
        CheckboxWithReactiveFormRequiredInputComponent
      );
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');

      formControl = testComponent.checkbox1;
      labelElement = checkboxElement.nativeElement.querySelector(
        'label.sky-checkbox-wrapper'
      );
    });

    it('should have required and aria-required attributes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.getAttribute('required')).not.toBeNull();
      expect(inputElement?.getAttribute('aria-required')).toEqual('true');
    });

    it('should update validator when required input is changed', async () => {
      fixture.detectChanges();
      expect(formControl.valid).toBe(false);
      testComponent.required = false;
      fixture.detectChanges();
      expect(formControl.valid).toBe(true);
      testComponent.required = true;
      fixture.detectChanges();
      expect(formControl.valid).toBe(false);
    });

    it('should mark form as invalid when required checkbox is not checked', async () => {
      fixture.detectChanges();
      expect(formControl.valid).toBe(false);
      labelElement?.click();
      expect(formControl.valid).toBe(true);
      labelElement?.click();
      expect(formControl.valid).toBe(false);
    });
  });

  describe('with name attribute', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(CheckboxWithNameAttributeComponent);

      fixture.detectChanges();
    });

    it('should forward name value to input element', () => {
      const checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      const inputElement = checkboxElement.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('name')).toBe('test-name');
    });

    it('should handle the name being set to undefined', () => {
      const checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      fixture.componentInstance.name = undefined;
      fixture.detectChanges();

      const inputElement = checkboxElement.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('name')).toEqual(
        jasmine.stringMatching(/sky-checkbox-MOCK_ID_[0-9]/)
      );
    });
  });

  describe('Checkbox icon component', () => {
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleCheckboxComponent);
      debugElement = fixture.debugElement;
    });

    it('should set icon based on input', () => {
      fixture.detectChanges();

      let checkboxIcon = debugElement.query(By.css('i')).nativeElement;
      expect(checkboxIcon).toHaveCssClass('fa-bold');

      fixture.componentInstance.icon = 'umbrella';
      fixture.detectChanges();

      checkboxIcon = debugElement.query(By.css('i')).nativeElement;
      expect(checkboxIcon).toHaveCssClass('fa-umbrella');
    });

    it('should set span class based on checkbox type input', () => {
      fixture.detectChanges();

      let span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-info');

      fixture.componentInstance.checkboxType = 'info';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-info');

      fixture.componentInstance.checkboxType = 'success';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-success');

      fixture.componentInstance.checkboxType = 'warning';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-warning');

      fixture.componentInstance.checkboxType = 'danger';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-danger');
    });

    it('should log a deprecation warning when checkboxType is set', () => {
      const logService = TestBed.inject(SkyLogService);
      const deprecatedLogSpy = spyOn(logService, 'deprecated').and.stub();

      fixture.componentInstance.checkboxType = 'warning';
      fixture.detectChanges();

      expect(deprecatedLogSpy).toHaveBeenCalledWith(
        'SkyCheckboxComponent.checkboxType',
        Object({
          deprecationMajorVersion: 7,
        })
      );
    });

    it('should pass accessibility', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('with a consumer using OnPush change detection', () => {
    let checkboxElement: DebugElement;
    let testComponent: CheckboxWithOnPushChangeDetectionComponent;
    let inputElement: HTMLInputElement | null | undefined;
    let checkboxNativeElement: HTMLElement | null;

    beforeEach(async () => {
      fixture = TestBed.createComponent(
        CheckboxWithOnPushChangeDetectionComponent
      );
      fixture.detectChanges();

      await fixture.whenStable();
      checkboxElement = fixture.debugElement.query(
        By.directive(SkyCheckboxComponent)
      );
      checkboxNativeElement = checkboxElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;

      inputElement = checkboxNativeElement?.querySelector('input');
    });

    it('should change check state through ngModel programmatically', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(false);
      expect(testComponent.isChecked).toBe(false);
      fixture.detectChanges();
      testComponent.isChecked = true;
      testComponent.ref.markForCheck();

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(inputElement?.checked).toBe(true);
    });
  });
});
