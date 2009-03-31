class RobberiesController < ApplicationController
  before_filter :require_user, :fetch_game

  def create
    @robbery = @game.robberies.build(params[:robbery])
    @robbery.user = @current_user
    if @robbery.save
      flash[:success] = "Successfully created"
    else
      flash[:error] = "Could not create"
    end
    redirect_to game_path(@game)
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
