HexesController = MVC.Controller.Stateful.extend("hexes",
{
  click: function(params) {
    alert("clicked!");
  },

  mouseover: function(params) {
    params.element.style.backgroundColor = "green";
  },

  mouseout: function(params) {
    params.element.style.backgroundColor = "";
  }
}
);
