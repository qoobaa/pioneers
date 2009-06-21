module AttrModifier
  def attr_modifier(*attr_names)
    attr_names.each do |attr_name|
      attr_accessor "#{attr_name}_modifier"

      define_method("modified_#{attr_name}") do
        attr = send(attr_name)
        modifier = send("#{attr_name}_modifier")
        modifier ? attr + modifier.to_i : attr
      end

      alias_method "modified_#{attr_name}_before_type_cast", "modified_#{attr_name}"

      before_save do |model|
        model[attr_name] = model.send("modified_#{attr_name}")
      end
    end
  end
end
