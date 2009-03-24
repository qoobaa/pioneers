class CreateDiceRolls < ActiveRecord::Migration
  def self.up
    create_table :dice_rolls do |t|
      t.integer :game_id
      t.integer :value
      t.integer :turn
      t.timestamps
    end
  end

  def self.down
    drop_table :dice_rolls
  end
end
