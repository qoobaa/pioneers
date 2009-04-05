module PlayersHelper
  def classes_for_player(player)
    classes = []
    classes << "player-#{player.number}"
    classes << "current" if player.current?
    classes.join(" ")
  end
end
