class AddCardsToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :army_cards, :integer
    add_column :games, :monopoly_cards, :integer
    add_column :games, :year_of_plenty_cards, :integer
    add_column :games, :road_building_cards, :integer
    add_column :games, :victory_point_cards, :integer
  end

  def self.down
    remove_column :games, :victory_point_cards
    remove_column :games, :road_building_cards
    remove_column :games, :year_of_plenty_cards
    remove_column :games, :monopoly_cards
    remove_column :games, :army_cards
  end
end
