import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const Category = new Mongo.Collection('category');

if (Meteor.isServer) {

  Category.allow({
    'insert'(userId, doc) {
      return doc;
    } 
  });

  Meteor.publish('category', function() {
     return Category.find({});
  });
}


Meteor.methods({ 
  'category.insert'(categoryName) {
    if (Category.findOne({name:categoryName}) == null) {
      return Category.insert({name:categoryName});
    } else {
      var cat = Category.findOne({name:categoryName});
      return cat._id;
    } 
  }
});