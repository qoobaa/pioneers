class AddHarborToHex < ActiveRecord::Migration
  def self.up
    add_column :hexes, :harbor_position, :integer
    add_column :hexes, :harbor_type, :string
  end

  def self.down
    remove_column :hexes, :harbor_type
    remove_column :hexes, :harbor_position
  end
end
