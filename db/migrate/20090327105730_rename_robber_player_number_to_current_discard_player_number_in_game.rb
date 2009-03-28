class RenameRobberPlayerNumberToCurrentDiscardPlayerNumberInGame < ActiveRecord::Migration
  def self.up
    change_table :games do |t|
      t.rename :robber_player_number, :current_discard_player_number
    end
  end

  def self.down
    change_table :games do |t|
      t.rename :current_discard_player_number, :robber_player_number
    end
  end
end
