class CreateOffers < ActiveRecord::Migration
  def self.up
    create_table :offers do |t|
      t.integer :bricks
      t.integer :grain
      t.integer :ore
      t.integer :wool
      t.integer :lumber
      t.integer :sender_id
      t.integer :recipient_id
      t.integer :game_id
      t.string :state
      t.timestamps
    end
  end

  def self.down
    drop_table :offers
  end
end
