class RenameAasmStateToStateInGame < ActiveRecord::Migration
  def self.up
    rename_column :games, :aasm_state, :state
  end

  def self.down
    rename_column :games, :state, :aasm_state
  end
end
