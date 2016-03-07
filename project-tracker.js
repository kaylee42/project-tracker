Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient){
   Template.body.helpers({
     tasks: function(){
       return Tasks.find({}, {sort: {createdAt: -1}});
     }
   });

   Template.body.events({
     "submit #new-task-form": function(event){
       event.preventDefault();
       var task = event.target.task.value;
       var notes = event.target.notes.value;

       Tasks.insert({
         task: task,
         notes: notes,
         createdAt: new Date()
       });

       document.getElementById("new-task-form").reset();

     }
   });
   Template.task.events({
     "dblclick .editable": function(event, target){
       return Session.set("target" + target.data._id, true);
     },
     "dblclick .editable2": function(event, target){
       return Session.set("target2" + target.data._id, true);
     },
     "keypress .savable": function(event, target){
       if(event.keyCode == 13){
         Tasks.update(this._id, {
           $set: {task: event.currentTarget.value}
         });
         return Session.set("target" + target.data._id, false);
       }
     },
     "keypress .savable2": function(event, target){
       if(event.keyCode == 13){
         Tasks.update(this._id, {
           $set: {notes: event.currentTarget.value}
         });
         return Session.set("target2" + target.data._id, false);
       }
     }
   });

   Template.task.helpers({
     formatDate: function(date){
       return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
     },
     editing: function(){
       return Session.get("target" + this._id);
     },
     editing2: function(){
       return Session.get("target2" + this._id);
     }
   });
}

// if (Meteor.isClient) {
//   // counter starts at 0
//   Session.setDefault('counter', 0);
//
//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });
//
//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }
//
// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }
