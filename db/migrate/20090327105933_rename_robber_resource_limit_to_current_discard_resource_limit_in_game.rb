class RenameRobberResourceLimitToCurrentDiscardResourceLimitInGame < ActiveRecord::Migration
  def self.up
    change_table :games do |t|
      t.rename :robber_resource_limit, :current_discard_resource_limit
    end
  end

  def self.down
    change_table :games do |t|
      t.rename :current_discard_resource_limit, :robber_resource_limit
    end
  end
end
