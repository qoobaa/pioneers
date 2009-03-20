class AddRobberToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :robber_player_number, :integer
    add_column :games, :robber_resource_limit, :integer
  end

  def self.down
    remove_column :games, :robber_resource_limit
    remove_column :games, :robber_player_number
  end
end
