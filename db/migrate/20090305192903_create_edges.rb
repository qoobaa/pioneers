class CreateEdges < ActiveRecord::Migration
  def self.up
    create_table :edges do |t|
      t.integer :row
      t.integer :col
      t.integer :player_id
      t.integer :map_id
    end
  end

  def self.down
    drop_table :edges
  end
end
