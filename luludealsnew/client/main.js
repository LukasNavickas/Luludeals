import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/startup/client';

Template.registerHelper('PriceFix', function (a) {
      return a.toFixed(2);
});

Template.registerHelper('ifAdmin', function (a) {
      if(Meteor.user() && Meteor.user().emails[0].address.includes("guest")) {
            return false;
      } else if (!Meteor.user()) {
            return false;
      } else {
            return true;
      }
});

Template.registerHelper('equals', function (a, b) {
      return a == b;
});

Template.registerHelper('notnull', function (a) {
      if (a) {
          return true;
      } else {
          return false;
      }
});

Template.registerHelper('itemPrice', function (a, b) {
      var num = a*b;
      return num.toFixed(2);
});

Template.registerHelper('addPrices', function (a, b) {
      var num = a + b;
      return num.toFixed(2);
});



// $(window).scroll(function() {    
//     var scroll = $(window).scrollTop();

//     if (scroll >= 500) {
//         $(".tags_Section").addClass("quitTags");
//     } else {
//         $(".tags_Section").removeClass("quitTags");
//     }
// });

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
