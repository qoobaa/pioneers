class AddRobberPhaseToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :robber_phase, :string
  end

  def self.down
    remove_column :games, :robber_phase
  end
end
