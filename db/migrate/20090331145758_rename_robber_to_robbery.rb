class RenameRobberToRobbery < ActiveRecord::Migration
  def self.up
    rename_table :robbers, :robberies
    remove_column :robberies, :map_id
    remove_column :robberies, :moved
    add_column :robberies, :bricks, :integer
    add_column :robberies, :grain, :integer
    add_column :robberies, :lumber, :integer
    add_column :robberies, :ore, :integer
    add_column :robberies, :wool, :integer
    add_column :robberies, :game_id, :integer
    add_column :robberies, :sender_id, :integer
    add_column :robberies, :recipient_id, :integer
  end

  def self.down
    rename_table :robberies, :robbers
    add_column :robbers, :map_id, :integer
    add_column :robbers, :moved, :integer
    remove_column :robbers, :bricks
    remove_column :robbers, :grain
    remove_column :robbers, :lumber
    remove_column :robbers, :ore
    remove_column :robbers, :wool
    remove_column :robbers, :game_id
    remove_column :robbers, :sender_id
    remove_column :robbers, :recipient_id
  end
end
