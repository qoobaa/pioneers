class RemoveCurrentRollFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :current_roll
  end

  def self.down
    add_column :games, :current_roll, :integer
  end
end
