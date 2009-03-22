class RemoveRobberFromMap < ActiveRecord::Migration
  def self.up
    remove_column :maps, :robber_col
    remove_column :maps, :robber_row
  end

  def self.down
    add_column :maps, :robber_row, :integer
    add_column :maps, :robber_col, :integer
  end
end
