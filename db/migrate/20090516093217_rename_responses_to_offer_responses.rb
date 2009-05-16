class RenameResponsesToOfferResponses < ActiveRecord::Migration
  def self.up
    rename_table :responses, :offer_responses
  end

  def self.down
    rename_table :offer_responses, :responses
  end
end
