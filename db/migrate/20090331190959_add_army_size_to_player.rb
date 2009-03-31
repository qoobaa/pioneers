class AddArmySizeToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :army_size, :integer
  end

  def self.down
    remove_column :players, :army_size
  end
end
