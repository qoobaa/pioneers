module JsonMethods
  def json_methods(attributes)
    define_method(:to_json_with_mode) do |mode = :default|
      methods = attributes[mode]
      elements = []
      case methods
      when Array
        elements = methods.map { |method| JsonMethods.jsonify_element(method, self.send(method), mode) }
      when Hash
        elements = methods.map { |key, method| JsonMethods.jsonify_element(key, self.send(method), mode) }
      else
        raise ArgumentError, "unknown mode #{mode} in #{self}"
      end
      result = "{"
      result << elements.join(",")
      result << "}"
    end
    alias_method_chain :to_json, :mode
  end

  protected

  def self.jsonify_element(key, value, mode)
    result = ActiveSupport::JSON.encode(key)
    result << ":"
    if value.kind_of?(Array)
      objects = value.map { |o| jsonify_object(o, mode) }
      result << "["
      result << objects.join(",")
      result << "]"
    else
      result << jsonify_object(value, mode)
    end
    result
  end

  def self.jsonify_object(value, mode)
    value.respond_to?(:to_json_with_mode) ? value.to_json_with_mode(mode) : value.to_json
  end
end
