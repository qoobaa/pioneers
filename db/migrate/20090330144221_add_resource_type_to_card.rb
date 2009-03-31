class AddResourceTypeToCard < ActiveRecord::Migration
  def self.up
    add_column :cards, :resource_type, :string
  end

  def self.down
    remove_column :cards, :resource_type
  end
end
