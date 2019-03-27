import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Product } from './product.js';

export const Cart = new Mongo.Collection('cart');

Cart.helpers({
    cartproduct:function(){
        return Product.findOne({_id:this.product});
    }
});


Cart.allow({
    'insert'(userId, doc) {
      return userId;
    },
    'update'() {
      return true;
    }
  });


if (Meteor.isServer) {
  Meteor.publish('usercart', function() {
     return Cart.find({userId:this.userId});
  });
}

Meteor.methods({ 
  'cart.addItem'(product, qty, option, shipMethod) {
    var exists = Cart.findOne({userId:Meteor.userId(), product:product, option:option});
      if (exists) {
        return Cart.update(exists, {$inc: {qty:qty}});
        // add a note for a client: you already  have this product in your cart. You can increase the quantity by vsiting your cart.
      }
    return Cart.insert({userId:Meteor.userId(), product:product, qty:qty, option:option, shipping:shipMethod});
  },
  'cart.updateQuant'(id, newQuant) {
    return Cart.update({_id:id}, {$set: {qty:newQuant}});
  },
  'cart.updateOption'(id, newOption) {
    return Cart.update({_id:id}, {$set: {option:newOption}});
  },
  'cart.updateShip'(id, newShip) {
    return Cart.update({_id:id}, {$set: {shipping:newShip}});
  },
  'cart.userChange'(UserShipAddress) {
    Meteor.users.update({_id:Meteor.userId()}, { $set: {profile:UserShipAddress} });
  },
  'cart.userBillChange'(UserBillAddress) {
    Meteor.users.update({_id:Meteor.userId()}, { $set: {UserBillAddress} });
  },
  'cart.deleteKorb'(KorbId) {
    Cart.remove(KorbId);
  }
});