class Message
  def self.connection
    @bunny ||= Bunny.new
    @bunny.start unless @bunny.status == :connected
    @bunny
  end

  def self.create(game_id, id)
    queue = connection.queue(id)
    queue.delete
    queue = connection.queue(id)
    queue.bind("games", :key => game_id)
    queue
  end

  def self.all(id)
    queue = connection.queue(id)
    messages = []
    loop do
      message = queue.pop
      break if message == :queue_empty
      messages << message
    end
    messages
  end
end
