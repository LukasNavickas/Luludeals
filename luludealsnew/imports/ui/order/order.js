import { Product } from '../../api/product.js';
import { Invoice } from '../../api/billing.js';
import { Cart } from '../../api/cart.js';

import './order.html';

Template.registerHelper('checkName', function (productId) {
      return Product.findOne({_id:productId}).title;
});

Template.registerHelper('checkImage', function (productId) {
      return Product.findOne({_id:productId}).imageOne;
});

Template.registerHelper('checkShipTime', function (shipMet, productId) {
    if (shipMet == 1) {
        return Product.findOne({_id:productId}).timeStShip;
    } else {
        return Product.findOne({_id:productId}).timePrShip;
    }
      
});

Template.order.helpers({
    invoiceItems() {
        return Invoice.findOne(); 
    },    
});