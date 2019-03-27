import { Product } from '../../api/product.js';
import { Cart } from '../../api/cart.js';

import '../summary/summary.js';
import './cart.html';

Template.cart.rendered = function() {
    this.autorun(function() {
        var optionsCursor = Cart.find().count();
        if(optionsCursor > 0){
            setTimeout(function(){ $('select').material_select(); $('.collapsible').collapsible(); }, 50);
        }
})};

Template.cart.helpers({
    cartitems() {
        return Cart.find(); 
    },
    iterateIt() {
        return Array.apply(null, Array(10)).map(function (x, i) { return i; });
    },
    iterateToTen() {
         return [1,2,3,4,5];
    },
});



Template.cart.events({
    'change #quantPicker'(event, template) {
        var newQuant = $(event.target).val();
        Meteor.call('cart.updateQuant', this._id, newQuant);        
    },
    'change #optionPicker'(event, template) {
        var newOption = $(event.target).val();
        Meteor.call('cart.updateOption', this._id, newOption);  
    },
    'change #shipPicker'(event, template) {
        var newShip = $(event.target).val();
        console.log(newShip);
        Meteor.call('cart.updateShip', this._id, newShip);
    },
    'click .deleteKorbAbs'(event, template) {
        Meteor.call('cart.deleteKorb', this._id);
    }
});