import './register.html'

Template.register.helpers({
    ifUserExists() {
        if (Meteor.userId()) {
            return true;
        }
    }
})

Template.register.events({
    'click .logout'(event, template) {
        AccountsGuest.forced = false;
        Meteor.logout();
    },
});