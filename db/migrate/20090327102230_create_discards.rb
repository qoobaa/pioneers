class CreateDiscards < ActiveRecord::Migration
  def self.up
    create_table :discards do |t|
      t.integer :lumber
      t.integer :grain
      t.integer :bricks
      t.integer :wool
      t.integer :ore
      t.integer :player_id
      t.integer :game_id

      t.timestamps
    end
  end

  def self.down
    drop_table :discards
  end
end
