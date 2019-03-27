import { Product } from '../../api/product.js';
import { Cart } from '../../api/cart.js';

import './summary.html';

Template.registerHelper('checkIfShow', function (a) {
      if (a == 1) {
          return true;
      } else {
          return false;
      }
});

Template.summary.rendered = function() {
    this.autorun(function() {
        var optionsCursor = Cart.find().count();
        if(optionsCursor > 0){
            setTimeout(function(){ $('.collapsible').collapsible(); }, 50);
        }
})};

Template.summary.helpers({
    total(){
        var total = {};
        total.shipping = 0;
        total.price = 0;
        var cart = Cart.find().fetch();
        for(var i = 0;i < cart.length;i++){
            var product = Product.findOne({_id:cart[i].product});
            if (cart[i].shipping == 1) {
                total.shipping = total.shipping + Number(product.priceStShip);
            } else if (cart[i].shipping == 2) {
                total.shipping = total.shipping + Number(product.pricePrShip);
            }
            total.price += product.price * cart[i].qty;
        }
        return total;
    },
    moreThanZero(total) {
        if (total.price > 0) {
            return true;
        } else {
            return false;
        }
    }
});