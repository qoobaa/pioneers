Game = MVC.Model.JsonRest.extend('game',
{
  find_one_get_url: function(params) {
    var id = params.id;
    delete params.id;
    return "/games/" + id + ".json";
  },

  find_one_get_success: function(transport) {
    var json = this.json_from_string(transport.responseText);
    return this.create_as_existing(json.game);
  }
},
{
}
);
