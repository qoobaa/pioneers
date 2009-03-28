class CreateResponses < ActiveRecord::Migration
  def self.up
    create_table :responses do |t|
      t.integer :player_id
      t.integer :offer_id
      t.boolean :agreed

      t.timestamps
    end
  end

  def self.down
    drop_table :responses
  end
end
