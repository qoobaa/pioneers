class AddRobberPositionToMap < ActiveRecord::Migration
  def self.up
    add_column :maps, :robber_col, :integer
    add_column :maps, :robber_row, :integer
  end

  def self.down
    remove_column :maps, :robber_row
    remove_column :maps, :robber_col
  end
end
