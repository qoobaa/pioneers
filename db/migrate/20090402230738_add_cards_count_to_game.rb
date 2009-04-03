class AddCardsCountToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :cards_count, :integer
  end

  def self.down
    remove_column :games, :cards_count
  end
end
