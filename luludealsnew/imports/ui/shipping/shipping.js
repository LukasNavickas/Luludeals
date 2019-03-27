import { Product } from '../../api/product.js';
import { Cart } from '../../api/cart.js';
import './shipping.html';

Template.shipping.rendered = function() {
    this.autorun(function() {
        var optionsCursor = Cart.find().count();
        var usersInformation = Meteor.user().profile.first_name;
        if(optionsCursor > 0){
            if (usersInformation != undefined) {
                $("label").addClass( "active" );
            }     
            setTimeout(function(){ $('.collapsible').collapsible(); }, 50);
        }
})};

Template.shipping.helpers({
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
    usersInfo(){
            return Meteor.user();

        
    }
});

Template.shipping.events({
    'click #different_address'(event, template) {
        $('#secForm').toggleClass("HideAndSeek");
    },
     'click .addShipping'(event, template) {
        event.preventDefault();
        var UserAddress = {};
        var UserBillingAddress = {};

        if (!$("#first_name").val() || !$("#last_name").val() || !$("#country").val() || !$("#city").val() || !$("#street").val()
            || !$("#street_number").val() || !$("#street").val() || !$("#email").val() || !$("#phone").val()) {
            Materialize.toast('Please fill in all required fields (*)', 3000, 'red');
            return false;
        }

        UserAddress.first_name = $("#first_name").val();
        UserAddress.last_name = $("#last_name").val();
        UserAddress.country = $("#country").val();
        UserAddress.city = $("#city").val();
        UserAddress.street = $("#street").val();
        UserAddress.streetNr = $("#street_number").val();
        UserAddress.zip = $("#street").val();
        UserAddress.region = $("#region").val();
        UserAddress.email = $("#email").val();
        UserAddress.phone = $("#phone").val();
        console.log(($("#first_name2").val()));
        if ($("#first_name2").val() != undefined) {
            

            UserBillingAddress.first_name2 = $("#first_name2").val();
            UserBillingAddress.last_name2 = $("#last_name2").val();
            UserBillingAddress.country2 = $("#country2").val();
            UserBillingAddress.city2 = $("#city2").val();
            UserBillingAddress.street2 = $("#street2").val();
            UserBillingAddress.streetNr2 = $("#street_number2").val();
            UserBillingAddress.zip2 = $("#zip2").val();
            UserBillingAddress.region2 = $("#region2").val();
            UserBillingAddress.email2 = $("#email2").val();
            UserBillingAddress.phone2 = $("#phone2").val();
            console.log('issauktantra');
            Meteor.call('cart.userBillChange', UserBillingAddress, function(error, result) {
                console.log('idejau!!! ' + result);
            });
        } 

        Meteor.call('cart.userChange', UserAddress);

        FlowRouter.go('/checkout');

        // target.title.value = '';
        // target.description.value = '';
        // target.category.value = '';
        // target.price.value = '';
        // target.price_st_ship.value = '';
        // target.time_st_ship.value = '';
        // target.price_pr_ship.value = '';
        // target.time_pr_ship.value = '';
        // target.image1.value = '';
        // target.image2.value = '';
        // target.image3.value = '';
        // target.image4.value = '';

        // $('.main_side_nav').sideNav('hide');
    }
});