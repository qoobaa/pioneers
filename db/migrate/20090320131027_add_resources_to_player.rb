class AddResourcesToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :resources, :integer
  end

  def self.down
    remove_column :players, :resources
  end
end
