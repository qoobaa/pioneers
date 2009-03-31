class AddCurrentTurnCardPlayedToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :current_turn_card_played, :boolean
  end

  def self.down
    remove_column :games, :current_turn_card_played
  end
end
