import { Meteor } from 'meteor/meteor';
import { Product } from '../imports/api/product.js';

import '../imports/api/product.js';
import '../imports/api/cart.js';
import '../imports/api/category.js';
import '../imports/api/billing.js';



Meteor.startup(() => {
  // code to run on server at startup
//   Meteor.publish('allUsers', function() {
//     cursor = Meteor.users.find({});
//     console.log(cursor.count());
//     return cursor;
// });
  Product._ensureIndex({"category":1});
  process.env.MAIL_URL = 'smtp://info@luludeals.com:Mumija99@smtp.mailgun.org:587';
});
