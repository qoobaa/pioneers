class RemoveCurrentPlayerNumberFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :current_player_number
  end

  def self.down
    add_column :games, :current_player_number, :integer
  end
end
