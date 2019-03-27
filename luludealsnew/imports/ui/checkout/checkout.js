import { Product } from '../../api/product.js';
import { Cart } from '../../api/cart.js';
import { Email } from 'meteor/email';

import './checkout.html';
import './email.html';

  Template.checkout.onRendered(function() {
   Session.set('spinnerWheel', 1); 
   Meteor.call('billing.calculateClient', function(error, clientInfo) {
     var newPrice = clientInfo.price;
     newPrice = newPrice.toFixed(2);
     Session.set('clientStuffPrice', newPrice);

     Meteor.call('billing.getClientToken', function(error, clientToken) {
      if (error) {
        
      } else {
        $( "input" ).addClass( "validate input-measures" );
        
        clientInfo.buyerId = Meteor.userId();

        Meteor.call('billing.addInvoice', clientInfo.cart, function(error, invoiceId) {

          Session.set('clientStuffId', invoiceId);
          Session.set('spinnerWheel', 0); 

          var data = {
            address: Meteor.user().profile,
            payment: 'We have got your payment already and we will ship your goods as quick as possible!',
            money: newPrice,
            invoiceId: invoiceId
          };

          var html = Blaze.toHTMLWithData(Template.email, data);

          braintree.setup(clientToken, "custom", {
            id: "payment-form", 
            hostedFields: {
              styles: {
              'input': {
                'font-size': '15px'
              },
              'input.valid': {
                'color': '#3b893e'
              },
              'input.invalid': {
                'color': 'red'
              }
            },
              number: {
                selector: "#card-number",
                placeholder: 'Credit Card Number'
              },
              cvv: {
                selector: "#cvv",
                placeholder: 'CVV'
              },
              expirationDate: {
                selector: "#expiration",
                placeholder: 'Expiration Date (MM/YY)'
              }
            },
            paypal: {
              container: 'paypal-container',
              singleUse: true, // Required
              amount: newPrice, // Required
              currency: 'EUR', // Required
              onSuccess: function (nonce, email) {
                Session.set('spinnerWheel', 1); 
                Meteor.call('billing.createTransaction', nonce, newPrice, invoiceId, function(error, success) {
                  if (error) {
                    Session.set('spinnerWheel', 0);
                    Materialize.toast('Your PayPal details were incorrect, try again', 4000, 'red');
                    throw new Meteor.Error('transaction-creation-failed');
                     
                  } else {
                    Meteor.call('billing.deleteCarts', function(error, deletedCarts) {
                      Meteor.call('billing.updateInvoice', invoiceId, function(error, updated) {
                        Session.set('spinnerWheel', 0); 
                        Meteor.call('billing.sendEmail', Meteor.user().profile.email, 'Luludeals.com <info@luludeals.com>' ,'Your order at Luludeals',html);
                        FlowRouter.go('/order/'+invoiceId);
                      }); 
                    })     
                  }
                });
              }
            },
            onPaymentMethodReceived: function (response) {
              Session.set('spinnerWheel', 1); 
              var nonce = response.nonce;

              Meteor.call('billing.createTransaction', nonce, newPrice, invoiceId, function(error, success) {
                if (error) {
                  Session.set('spinnerWheel', 0);
                  Materialize.toast('Your credit card details were incorrect, try again', 4000, 'red');
                  throw new Meteor.Error('transaction-creation-failed');
                } else {
                  Meteor.call('billing.deleteCarts', function(error, deletedCarts) {
                    Meteor.call('billing.updateInvoice', invoiceId, function(error, updated) {
                      Session.set('spinnerWheel', 0); 
                      Meteor.call('billing.sendEmail', Meteor.user().profile.email, 'Luludeals.com <info@luludeals.com>' ,'Your order at Luludeals',html);
                      FlowRouter.go('/order/'+invoiceId);
                    });    
                  })  
                }
              });
            }
          });
       });
      }
    });
   })
    
  });  

Template.checkout.rendered = function() {
    this.autorun(function() {
        var optionsCursor = Cart.find().count();
        if(optionsCursor > 0){
            setTimeout(function(){ $('.collapsible').collapsible(); }, 50);
        }
})};


Template.checkout.helpers({
    clientPrice() {
      return Session.get('clientStuffPrice');        
    },
    clientOrderId() {
      return Session.get('clientStuffId');   
    },
    isChanged() {
      if (Session.get('spinnerWheel') == 1) {
        return true;
      } else {
        return false;
      }
    }
});

Template.checkout.events({
    'click .notPaid'(event, template) {
        Meteor.call('billing.deleteCarts', function(error, deletedCarts) {
            var id = Session.get('clientStuffId');
            var money = Session.get('clientStuffPrice');
            
            var data = {
              address: Meteor.user().profile,
              payment: 'We are waiting for your payment and we will ship your goods as quick as possible when we got it!',
              money: money,
              invoiceId: id
            };
            var html = Blaze.toHTMLWithData(Template.email, data);

            Meteor.call('billing.sendEmail', Meteor.user().profile.email, 'Luludeals.com <info@luludeals.com>' ,'Your order at Luludeals',html);
            FlowRouter.go('/order/'+id); 
        }) 
    },
})



        
        