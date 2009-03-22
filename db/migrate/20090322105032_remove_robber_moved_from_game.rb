class RemoveRobberMovedFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :robber_moved
  end

  def self.down
    add_column :games, :robber_moved, :boolean
  end
end
