EdgesController = MVC.Controller.extend("edges",
{
  click: function(params) {
    alert("clicked!");
  },

  mouseover: function(params) {
    params.element.style.backgroundColor = "blue";
  },

  mouseout: function(params) {
    params.element.style.backgroundColor = "";
  }
}
);
