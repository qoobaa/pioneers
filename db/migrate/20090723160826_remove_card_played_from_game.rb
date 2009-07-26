class RemoveCardPlayedFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :card_played
  end

  def self.down
    add_column :games, :card_played, :boolean
  end
end
