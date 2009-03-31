class AddVisiblePointsAndHiddenPointsToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :visible_points, :integer
    add_column :players, :hidden_points, :integer
  end

  def self.down
    remove_column :players, :hidden_points
    remove_column :players, :visible_points
  end
end
