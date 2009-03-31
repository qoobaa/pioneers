class CreateExchanges < ActiveRecord::Migration
  def self.up
    create_table :exchanges do |t|
      t.integer :player_id
      t.integer :game_id
      t.integer :bricks
      t.integer :grain
      t.integer :ore
      t.integer :wool
      t.integer :lumber

      t.timestamps
    end
  end

  def self.down
    drop_table :exchanges
  end
end
