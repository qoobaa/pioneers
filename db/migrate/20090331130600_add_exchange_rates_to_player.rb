class AddExchangeRatesToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :bricks_exchange_rate, :integer
    add_column :players, :grain_exchange_rate, :integer
    add_column :players, :lumber_exchange_rate, :integer
    add_column :players, :ore_exchange_rate, :integer
    add_column :players, :wool_exchange_rate, :integer
  end

  def self.down
    remove_column :players, :wool_exchange_rate
    remove_column :players, :ore_exchange_rate
    remove_column :players, :lumber_exchange_rate
    remove_column :players, :grain_exchange_rate
    remove_column :players, :bricks_exchange_rate
  end
end
