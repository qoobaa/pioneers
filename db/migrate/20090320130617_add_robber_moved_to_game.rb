class AddRobberMovedToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :robber_moved, :boolean
  end

  def self.down
    remove_column :games, :robber_moved
  end
end
