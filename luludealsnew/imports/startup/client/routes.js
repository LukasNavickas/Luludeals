import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layout/layout.js';
import '../../ui/main_page/main_page.js';
import '../../ui/register/register.js';
import '../../ui/navbar/navbar.js';
import '../../ui/cart/cart.js';
import '../../ui/shipping/shipping.js';
import '../../ui/checkout/checkout.js';
import '../../ui/order/order.js';

import '../../api/category.js';
import '../../api/product.js';
import '../../api/cart.js';
import '../../api/billing.js';

FlowRouter.route('/', {
    subscriptions() {
        Meteor.subscribe('product');
        Meteor.subscribe('category');
        Meteor.subscribe('usercart');     
        // Meteor.subscribe("allUsers");
    },
    action() {
        Tracker.autorun(function() {
                BlazeLayout.render('layout', {main:'main_page'});
        });
    }
});

FlowRouter.route('/order/:orderId', {
    subscriptions: function(params, queryParams) {
        Meteor.subscribe('product');
        Meteor.subscribe('category'); 
        this.register('invoices', Meteor.subscribe('invoices', params.orderId));
           
    },
    action() {
        BlazeLayout.render('layout', {main:'order'});
    }
});

FlowRouter.route('/cart', {
    subscriptions: function(params, queryParams) {
        Meteor.subscribe('product');
        Meteor.subscribe('category');    
        Meteor.subscribe('usercart');
    },
    action() {
        BlazeLayout.render('layout', {main:'cart'});
    }
});


FlowRouter.route('/shipping', {
    subscriptions: function(params, queryParams) {
        Meteor.subscribe('product');
        Meteor.subscribe('category');    
        Meteor.subscribe('usercart');
    },
    action() {
        BlazeLayout.render('layout', {main:'shipping'});
    }
});

FlowRouter.route('/checkout', {
    subscriptions: function(params, queryParams) {
        Meteor.subscribe('product');
        Meteor.subscribe('category');    
        Meteor.subscribe('usercart');
    },
    action() {
        BlazeLayout.render('layout', {main:'checkout'});
    }
});

FlowRouter.route('/category/:CategoryName', {
    subscriptions: function(params, queryParams) {
        this.register('categoryProducts', Meteor.subscribe('catProducts', params.CategoryName));
        Meteor.subscribe('category');    
        Meteor.subscribe('usercart');
    },
    action() {
        BlazeLayout.render('layout', {main:'main_page'});
    }
});

FlowRouter.route('/for-vendors', {
    subscriptions: function(params, queryParams) {
        // this.register('usercart', Meteor.subscribe('usercart', Meteor.userId())); 
        Meteor.subscribe('usercart');
    },
    action() {
        Tracker.autorun(function() {
            BlazeLayout.render('layout', {main:'register'});
        });
        
    }
});