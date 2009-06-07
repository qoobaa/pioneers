class OfferResponse < ActiveRecord::Base
  include ToHash

  belongs_to :offer
  belongs_to :player

  before_validation :sum_resources

  validates_associated :player, :if => :agreed?
  validates_presence_of :player, :offer
  validates_inclusion_of :agreed, :in => [true, false]
  validates_uniqueness_of :player_id, :scope => :offer_id

  delegate :bricks, :grain, :lumber, :ore, :wool, :to => :offer, :prefix => true
  delegate :game, :to => :offer
  delegate :players, :to => :game, :prefix => true
  delegate :number, :to => :player, :prefix => true

  attr_reader :user

  def user=(user)
    @user = user
    self.player = user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  protected

  def sum_resources
    player.bricks -= (offer_bricks or 0)
    player.grain -= (offer_grain or 0)
    player.lumber -= (offer_lumber or 0)
    player.ore -= (offer_ore or 0)
    player.wool -= (offer_wool or 0)
  end
end
