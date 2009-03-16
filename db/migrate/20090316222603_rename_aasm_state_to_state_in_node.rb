class RenameAasmStateToStateInNode < ActiveRecord::Migration
  def self.up
    rename_column :nodes, :aasm_state, :state
  end

  def self.down
    rename_column :nodes, :state, :aasm_state
  end
end
