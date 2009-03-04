module EnumField
  # enum_field encapsulates a validates_inclusion_of and automatically gives you a
  # few more goodies automatically.
  #
  #     class Computer < ActiveRecord:Base
  #       extend EnumField
  #       enum_field :status, ['on', 'off', 'standby', 'sleep', 'out of this world']
  #
  #       # Optionally with a message to replace the default one
  #       # enum_field :status, ['on', 'off', 'standby', 'sleep'], :message => "incorrect status"
  #
  #       #...
  #     end
  #
  # This will give you a few things:
  #
  # - add a validates_inclusion_of with a simple error message ("invalid #{field}") or your custom message
  # - define the following query methods, in the name of expressive code:
  #   - on?
  #   - off?
  #   - standby?
  #   - sleep?
  #   - out_of_this_world?
  # - define the STATUSES constant, which contains the acceptable values
  def enum_field(field, possible_values, options={})
    field_name = field.to_s.gsub(/_/, " ")
    message = options[:message] || "invalid #{field_name}"
    const_set field.to_s.pluralize.upcase, possible_values unless const_defined?(field.to_s.pluralize.upcase)

    possible_values.each do |current_value|
      method_name = current_value.downcase.gsub(/[-\s]/, '_')
      define_method("#{method_name}?") do
        self.send(field) == current_value
      end
    end

    validates_inclusion_of field, :in => possible_values, :message => message
  end
end
