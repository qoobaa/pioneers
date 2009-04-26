StompController = MVC.Controller.extend("stomp",
{
  onmessageframe: function(frame) {
    // var message = Model.Ajax.json_from_string(frame.body);
    // Controller.controllers[message.controller][0].dispatch(message.action, message);
    alert(frame.body);
  }
}
);
