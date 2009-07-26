class AddCardIdToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :card_id, :integer
  end

  def self.down
    remove_column :games, :card_id
  end
end
