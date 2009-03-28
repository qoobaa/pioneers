class Response < ActiveRecord::Base
  belongs_to :offer
  belongs_to :player

  validates_associated :offer, :player, :if => :agreed?
  validates_presence_of :player, :offer
  validates_uniqueness_of :player, :scope => :offer_id

  protected

  def sum_resources
    player.bricks += (bricks or 0)
    player.grain += (grain or 0)
    player.lumber += (lumber or 0)
    player.ore += (ore or 0)
    player.wool += (wool or 0)
  end
end
