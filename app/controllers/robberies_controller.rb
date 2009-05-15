class RobberiesController < ApplicationController
  before_filter :require_user, :fetch_game

  def create
    @robbery = @game.robberies.build(params[:robbery])
    @robbery.user = @current_user
    if true # @robbery.save
      hex = @robbery.to_hash(:position)
      robbery = @robbery.to_hash(:sender => :sender_number, :recipient => :recipient_number, :bricks => :bricks, :grain => :grain, :lumber => :lumber, :ore => :ore, :wool => :wool)
      game = @game.to_hash(:phase => :phase, :discardPlayer => :current_discard_player_number)
      players = [@robbery.recipient.to_hash(:resources, :number)]
      players << @robbery.sender.to_hash(:resources, :number) if @robbery.sender
      stomp_send(@game, { :event => "robberMoved", :hex =>  hex, :game => game, :players => players, :robbery => robbery })
      render :nothing => true, :status => :created
    else
      render :nothing => true, :status => :unprocessable_entity
    end
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
