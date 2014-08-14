/// <reference path="../_all.d.ts" />
var Common;
(function (Common) {
    'use strict';

    var PickADateDirective = (function () {
        function PickADateDirective() {
        }
        PickADateDirective.GetNewInstance = function () {
            var instance = new PickADateDirective();

            return {
                scope: {
                    pickADate: '=',
                    minDate: '=',
                    maxDate: '=',
                    pickADateOptions: '='
                },
                link: $.proxy(instance.Link, instance)
            };
        };

        PickADateDirective.prototype.Link = function (scope, element, attrs) {
            var _this = this;
            this.$scope = scope;
            var options = $.extend(this.$scope.pickADateOptions || {}, {
                onSet: $.proxy(this.OnValueChanged, this),
                onClose: function () {
                    element.blur();
                },
                min: scope.minDate,
                max: scope.maxDate
            });
            this.datePicker = element.pickadate(options).pickadate('picker');
            this.UpdateValue(this.$scope.pickADate);

            this.$scope.$watch('pickADate', $.proxy(function (newValue, oldValue) {
                if (newValue != oldValue) {
                    _this.UpdateValue(newValue);
                }
            }, this), true);
            this.$scope.$watch('minDate', $.proxy(function (newValue, oldValue) {
                _this.datePicker.set('min', newValue ? newValue : false);
            }, this), true);
            this.$scope.$watch('maxDate', $.proxy(function (newValue, oldValue) {
                _this.datePicker.set('max', newValue ? newValue : false);
            }, this), true);
        };

        PickADateDirective.prototype.OnValueChanged = function (e) {
            var _this = this;
            // we are coming from $watch or link setup
            if (this.$scope.$$phase || this.$scope.$root.$$phase) {
                return;
            }
            var select = this.datePicker.get('select');

            // skip the highlighing while navigating months
            if (!select) {
                return;
            }

            this.$scope.$apply(function () {
                if (e.hasOwnProperty('clear')) {
                    _this.$scope.pickADate = null;
                } else if (select) {
                    _this.$scope.pickADate = select.obj;
                }
            });
        };

        PickADateDirective.prototype.UpdateValue = function (newValue) {
            if (newValue) {
                var value = (newValue instanceof Date) ? newValue : new Date(newValue);

                // needs to be in milliseconds
                this.datePicker.set('select', value.getTime());
            } else {
                this.datePicker.clear();
            }
        };
        return PickADateDirective;
    })();
    Common.PickADateDirective = PickADateDirective;
})(Common || (Common = {}));
//# sourceMappingURL=PickADateDirective.js.map
