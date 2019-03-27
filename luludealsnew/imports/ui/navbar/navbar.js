import { Cart } from '../../api/cart.js';

import './navbar.html';

Template.navbar.rendered = function() {
    this.autorun(function() {
            setTimeout(function(){ $(".main_side_nav").sideNav(); }, 500);
    })
};

Template.navbar.helpers({
    cartItems() {
        return Cart.find().count();
    }
})

Template.navbar.events({
    'submit .addItem'(event, template) {
        event.preventDefault();

        var item = {};
        const target = event.target;
        
        item.title = target.title.value;
        item.description = target.description.value;       
        item.price = target.price.value;
        item.priceStShip = target.price_st_ship.value;
        item.timeStShip = target.time_st_ship.value;
        item.pricePrShip = target.price_pr_ship.value;
        item.timePrShip = target.time_pr_ship.value;
        item.options = $('.chips').material_chip('data');
        item.imageOne = target.image1.value;
        item.qty = 1;
        item.images = [];
            if (target.image2.value != '') { item.images.push(target.image2.value); }
            if (target.image3.value != '') { item.images.push(target.image3.value); }
            if (target.image4.value != '') { item.images.push(target.image4.value); }

        Meteor.call('category.insert', target.category.value, function(error, result) {
            item.category = result;
            Meteor.call('product.addItem', item, function(error, result) {
                $('i.material-icons.close').trigger('click');
            });
        });    

        

        target.title.value = '';
        target.description.value = '';
        target.category.value = '';
        target.price.value = '';
        target.price_st_ship.value = '';
        target.time_st_ship.value = '';
        target.price_pr_ship.value = '';
        target.time_pr_ship.value = '';
        target.image1.value = '';
        target.image2.value = '';
        target.image3.value = '';
        target.image4.value = '';

        $('.main_side_nav').sideNav('hide');
    }
});
