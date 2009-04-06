class User < ActiveRecord::Base
  acts_as_authentic
  has_many :players

  def idle?
    Time.now - last_request_at > 30
  end
end
