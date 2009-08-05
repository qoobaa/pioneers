class RemoveCurrentTurnCardPlayedFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :current_turn_card_played
  end

  def self.down
    add_column :games, :current_turn_card_played, :boolean
  end
end
