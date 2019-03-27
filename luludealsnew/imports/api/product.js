import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Category } from './category.js';
 
export const Product = new Mongo.Collection('product');

if (Meteor.isServer) {

  Product.allow({
    'insert'(userId, doc) {
      return doc;
    },
    'remove'(userId, doc) {
      return doc;
    }    
  });

  Meteor.publish('product', function() {
     return Product.find({});
  });

  Meteor.publish('catProducts', function(categoryName) {
    var catId = Category.findOne({name:categoryName})._id;
    return Product.find({category:catId});
  });

}


Meteor.methods({
  'product.addItem'(product) {
    return Product.insert(product);
  },
  'product.remove'(productId) {
    return Product.remove({_id:productId});
  }
});
