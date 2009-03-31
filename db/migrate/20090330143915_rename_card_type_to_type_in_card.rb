class RenameCardTypeToTypeInCard < ActiveRecord::Migration
  def self.up
    rename_column :cards, :card_type, :type
  end

  def self.down
    rename_column :card, :type, :cards_type
  end
end
