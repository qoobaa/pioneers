class RemoveRobberPhaseFromGame < ActiveRecord::Migration
  def self.up
    remove_column :games, :robber_phase
  end

  def self.down
    add_column :games, :robber_phase, :string
  end
end
