import { Category } from '../../api/category.js';
import { Product } from '../../api/product.js';

import './main_page.html';

/// infiniscroll

Session.set("ProductLimit", 9);
lastScrollTop = 0;
$(window).scroll(function(event){
// test if we are near the bottom of the window
if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  // where are we in the page?
  var scrollTop = $(this).scrollTop();
  // test if we are going down
  if (scrollTop > lastScrollTop){
    // yes we are heading down...
   $('select').material_select();
   Session.set("ProductLimit", Session.get("ProductLimit") + 6);
  }

  lastScrollTop = scrollTop;
 }

});

Template.main_page.rendered = function() {
this.autorun(function() {
    var optionsCursor = Product.find().count();
    if(optionsCursor > 0){
         $('select').material_select();
         $('.chips-placeholder').material_chip({
                placeholder: 'press Enter after each option',
                secondaryPlaceholder: 'Options? (e.g. S, M, L sizes for clothes)',
         });
    }
})};

Template.main_page.events({
    'click .deleteProduct'(event, template) {
        Meteor.call('product.remove', this._id);
    },
    'click .addToCart'(event, template) {
         var option = $("#"+this._id+"").val();
         if (option || option === undefined) {
             Materialize.toast('Item has been added!', 4000, 'rounded')
             Meteor.call('cart.addItem', this._id, 1, option, 1);
         } else if (option === null) {
             Materialize.toast('Please select an option!', 3000, 'red');
         }
         
    }
})

Template.main_page.helpers({
    categories() {        
        return Category.find({});
    },
    products() {
        return Product.find({}, {limit:Session.get("ProductLimit")});
    },
});