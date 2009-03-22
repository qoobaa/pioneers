class CreateRobbers < ActiveRecord::Migration
  def self.up
    create_table :robbers do |t|
      t.integer :row
      t.integer :col
      t.integer :map_id

      t.timestamps
    end
  end

  def self.down
    drop_table :robbers
  end
end
