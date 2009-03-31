class AddLargestArmyToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :largest_army_size, :integer
    add_column :games, :largest_army_player_id, :integer
  end

  def self.down
    remove_column :games, :largest_army_player_id
    remove_column :games, :largest_army_size
  end
end
