import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Product } from './product.js';
import { Cart } from './cart.js';
import { Email } from 'meteor/email';

export const Invoice = new Mongo.Collection('invoice');

// Invoice.helpers({
//     invoiceproduct:function(){
//       console.log('blt');
//         return Product.findOne({_id:this.product});
//     }
// });

if (Meteor.isServer) {
  Meteor.publish('invoices', function(invoiceId) {
     return Invoice.find({_id:invoiceId});
  });
}

Invoice.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
  doc.buyerId = Meteor.userId();
  doc.paid = false;
});

// Define gateway variable 
var gateway;

Meteor.startup(function () {
  var env;
  // Pick Braintree environment based on environment defined in Meteor settings.
  if (Meteor.settings.public.env === 'Production') {
    env = Braintree.Environment.Production;
  } else {
    env = Braintree.Environment.Sandbox;
  }
  // Initialize Braintree connection:
  gateway = BrainTreeConnect({
    environment: env,
    publicKey: Meteor.settings.public.BT_PUBLIC_KEY,
    privateKey: Meteor.settings.private.BT_PRIVATE_KEY,
    merchantId: Meteor.settings.public.BT_MERCHANT_ID
  });
});

Meteor.methods({
  'billing.calculateClient'() {
    var total = {};
        total.price = 0;
        total.shipping = 0;
        var cart = Cart.find({userId:Meteor.userId()}).fetch();
        total.cart = cart;
        for(var i = 0;i < cart.length;i++){
            var product = Product.findOne({_id:cart[i].product});
            if (cart[i].shipping == 1) {
                total.shipping = total.shipping + Number(product.priceStShip);
            } else if (cart[i].shipping == 2) {
                total.shipping = total.shipping + Number(product.pricePrShip);
            }
            total.price += product.price * cart[i].qty;
        }
        total.price = total.price + total.shipping;
        return total;
  },
  'billing.getClientToken'(clientId) {
    var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
    var options = {};

    if (clientId) {
      options.clientId = clientId;
    }

    var response = generateToken(options);
    return response.clientToken;
  },
  // 'billing.btCreateCustomer'(){
  //   var user = Meteor.user();

  //   var customerData = {
  //     email: user.emails[0].address
  //   };

  //   // Calling the Braintree API to create our customer!
  //   gateway.customer.create(customerData, function(error, response){
  //     if (error){
  //       console.log(error);
  //     } else {
  //       // If customer is successfuly created on Braintree servers,
  //       // we will now add customer ID to our User
  //       // Meteor.users.update(user._id, {
  //       //   $set: {
  //       //     customerId: response.customer.id
  //       //   }
  //       // });
  //     }
  //   });
  // },
  'billing.createTransaction'(nonceFromTheClient, price, invoiceId) {
    var user = Meteor.user();
    // Let's create transaction.
    gateway.transaction.sale({
      amount: price,
      orderId: invoiceId,
      paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
      options: {
        submitForSettlement: true, // Payment is submitted for settlement immediatelly
      }
    }, function (err, success) {
      if (err) { 
        console.log(err);
      } else {
        // When payment's successful, add "paid" role to current invoice.
        Invoice.update({_id:invoiceId}, { $set: {paid:true} });
      }
    });
  },
  'billing.addInvoice'(carts) {
    var invId = Invoice.insert({carts});
    return invId;
  },
  'billing.deleteCarts'() {
    return Cart.remove({userId:Meteor.userId()});
  },
  'billing.updateInvoice'(invoiceId) {
    return Invoice.update({_id:invoiceId}, {$set:{paid:true} });
  },
  'billing.sendEmail'(to, fromWhom, subject, html) {

    this.unblock();

    Email.send({
      to: to,
      from: fromWhom,
      subject: subject,
      html: html
    });
  }
});