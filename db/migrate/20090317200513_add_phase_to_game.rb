class AddPhaseToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :phase, :string
  end

  def self.down
    remove_column :games, :phase
  end
end
