class RobbersController < ApplicationController
  before_filter :require_user, :fetch_game

  def update
    @robber = @game.map_robber
    @robber.user = @current_user
    if @robber.update_attributes(params[:robber])
      flash[:success] = "Successfully updated"
    else
      flash[:error] = "Could not update"
    end
    redirect_to game_path(@game)
  end

  protected

  def fetch_game
    @game = Game.find(params[:game_id])
  end
end
