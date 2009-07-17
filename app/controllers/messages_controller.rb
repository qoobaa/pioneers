class MessagesController < ApplicationController
  def index
    @messages = Message.all(session[:session_id])
    render :text => @messages.join(", ")
  end
end
