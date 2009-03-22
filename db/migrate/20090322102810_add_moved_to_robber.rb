class AddMovedToRobber < ActiveRecord::Migration
  def self.up
    add_column :robbers, :moved, :boolean
  end

  def self.down
    remove_column :robbers, :moved
  end
end
