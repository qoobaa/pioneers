class AddLongestRoadToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :longest_road_length, :integer
    add_column :games, :longest_road_player_id, :integer
  end

  def self.down
    remove_column :games, :longest_road_player_id
    remove_column :games, :longest_road_length
  end
end
