 /// <reference path="../_all.d.ts" />

module Common {
    'use strict';

    export interface IPickADateScope extends ng.IScope {
        pickADate: Date;
        pickADateOptions: pickadateOptions;
        minDate:any;
        maxDate:any;
    }
}