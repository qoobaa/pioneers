class AddPlayerIdToDiceRoll < ActiveRecord::Migration
  def self.up
    add_column :dice_rolls, :player_id, :integer
  end

  def self.down
    remove_column :dice_rolls, :player_id
  end
end
