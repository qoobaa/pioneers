class AddStateToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :state, :string
  end

  def self.down
    remove_column :players, :state
  end
end
