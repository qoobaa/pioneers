class AddCurrentPlayerIdToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :current_player_id, :integer
  end

  def self.down
    remove_column :games, :current_player_id
  end
end
