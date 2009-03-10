class AddCurrentTurnAndCurrentRollToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :current_turn, :integer
    add_column :games, :current_roll, :integer
  end

  def self.down
    remove_column :games, :current_roll
    remove_column :games, :current_turn
  end
end
