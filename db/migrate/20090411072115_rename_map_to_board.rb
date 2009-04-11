class RenameMapToBoard < ActiveRecord::Migration
  def self.up
    rename_table :maps, :boards
    rename_column :hexes, :map_id, :board_id
    rename_column :nodes, :map_id, :board_id
    rename_column :edges, :map_id, :board_id
  end

  def self.down
    rename_table :boards, :maps
    rename_column :hexes, :board_id, :map_id
    rename_column :nodes, :board_id, :map_id
    rename_column :edges, :board_id, :map_id
  end
end
