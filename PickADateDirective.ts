/// <reference path="../_all.d.ts" />

module Common {
    'use strict';

    export class PickADateDirective {
        private $scope: IPickADateScope;
        private datePicker: DatePickerObject;

        public static GetNewInstance(): ng.IDirective {
            var instance = new PickADateDirective();

            return {
                scope: {
                    pickADate: '=',
                    minDate: '=',
                    maxDate: '=',
                    pickADateOptions: '='
                },
                link: $.proxy(instance.Link, instance)
            }
        }

        public Link(scope: IPickADateScope, element: JQuery, attrs: ng.IAttributes) {
            this.$scope = scope;
            var options = $.extend(this.$scope.pickADateOptions || {}, {
                onSet: $.proxy(this.OnValueChanged, this),
                onClose: () => { element.blur(); },
                min: scope.minDate,
                max: scope.maxDate,
            });
            this.datePicker = element.pickadate(options).pickadate('picker');
            this.UpdateValue(this.$scope.pickADate);
            
            this.$scope.$watch('pickADate', $.proxy((newValue, oldValue) => {
                if (newValue != oldValue) {
                    this.UpdateValue(newValue);
                }
            }, this), true);
            this.$scope.$watch('minDate', $.proxy((newValue, oldValue) => {
                this.datePicker.set('min', newValue ? newValue : false);
            }, this), true);
            this.$scope.$watch('maxDate', $.proxy((newValue, oldValue) => {
                this.datePicker.set('max', newValue ? newValue : false);
            }, this), true);
        }

        public OnValueChanged(e) {
            // we are coming from $watch or link setup
            if (this.$scope.$$phase || this.$scope.$root.$$phase) {
                return;
            }
            var select: DatePickerItemObject = this.datePicker.get('select');
            // skip the highlighing while navigating months
            if (!select) {
                return;
            }

            this.$scope.$apply(() => {
                if (e.hasOwnProperty('clear')) {
                    this.$scope.pickADate = null;
                } else if (select) {
                    this.$scope.pickADate = select.obj;
                }
            });
        }

        private UpdateValue(newValue) {
            if (newValue) {
                var value = (newValue instanceof Date) ? newValue : new Date(newValue);
                // needs to be in milliseconds
                this.datePicker.set('select', value.getTime());
            } else {
                this.datePicker.clear();
            }
        }
    }
} 