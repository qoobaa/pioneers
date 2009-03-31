class CreateCards < ActiveRecord::Migration
  def self.up
    create_table :cards do |t|
      t.integer :game_id
      t.integer :player_id
      t.string :card_type
      t.string :state
      t.integer :bricks
      t.integer :grain
      t.integer :lumber
      t.integer :ore
      t.integer :wool

      t.timestamps
    end
  end

  def self.down
    drop_table :cards
  end
end
