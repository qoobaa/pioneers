NodesController = MVC.Controller.extend('nodes',
{
  settlementBuilt: function(message) {
    $("#board").board("settlementBuilt", message.node);
  },

  click: function(params) {
    alert("clicked!");
  },

  mouseover: function(params) {
    params.element.style.backgroundColor = "red";
  },

  mouseout: function(params) {
    params.element.style.backgroundColor = "";
  }
}
);
