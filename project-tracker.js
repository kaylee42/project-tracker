Projects = new Mongo.Collection("projects");
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient){

   Template.body.helpers({
     projects: function(){
       return Projects.find({}, {sort: {createdAt: -1}});
     },
     tasks: function(){
       return Tasks.find({project: Session.get("currentProject")}, {sort: {createdAt: -1}});
     },
     currentProject: function(){
       if(Session.get("currentProject")){
         return Projects.find(Session.get("currentProject"));
       }else{
         return false;
       }
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
         project: Session.get("currentProject"),
         createdAt: new Date(),
       });

       document.getElementById("new-task-form").reset();

     },
     "submit #new-project": function(event){
       event.preventDefault();
       var project = event.target.project.value;
       var projectId = Projects.insert({
         name: project,
         tasks: [],
         createdAt: new Date()
       });
       document.getElementById("new-project").reset();
       $(".current-projects").val(projectId);
       return Session.set("currentProject", projectId);
     },
     "change .current-projects": function(){
       var projectId = $(".current-projects").val();
       return Session.set("currentProject", projectId);
     },

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
     },

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


  Template.current.events({
    "dblclick .editable3": function(event, target){
      console.log("HEY");
      return Session.set("target3" + target.data._id, true);
    },
    "keypress .savable3": function(event, target){
      if(event.keyCode == 13){
        Projects.update(this._id, {
          $set: {name: event.currentTarget.value}
        });
        return Session.set("target3" + target.data._id, false);
      }
    }
  });

  Template.current.helpers({
    editing3: function(){
      return Session.get("target3" + this._id);
    }
  });
}

if (Meteor.isServer) {

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
