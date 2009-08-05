module Generator
  ROLLS = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
  HARBORS = (["bricks", "grain", "lumber", "ore", "wool"] + ["generic"] * 4)
  SEAS = (["sea"] * 18)
  LANDS = (["desert"] + ["mountain"] * 3 + ["field"] * 4 + ["hill"] * 3 + ["forest"] * 4 + ["pasture"] * 4)
  HEXES_ATTRIBUTES =
    [
     { :position => [0, 3], :type => :sea, :harbor => [4] },
     { :position => [0, 4], :type => :sea, :harbor => [3, 4] },
     { :position => [0, 5], :type => :sea, :harbor => [3, 4] },
     { :position => [0, 6], :type => :sea, :harbor => [3] },
     { :position => [1, 6], :type => :sea, :harbor => [2, 3] },
     { :position => [2, 6], :type => :sea, :harbor => [2, 3] },
     { :position => [3, 6], :type => :sea, :harbor => [2] },
     { :position => [4, 5], :type => :sea, :harbor => [1, 2] },
     { :position => [5, 4], :type => :sea, :harbor => [1, 2] },
     { :position => [6, 3], :type => :sea, :harbor => [2] },
     { :position => [6, 2], :type => :sea, :harbor => [0, 1] },
     { :position => [6, 1], :type => :sea, :harbor => [0, 1] },
     { :position => [6, 0], :type => :sea, :harbor => [0] },
     { :position => [5, 0], :type => :sea, :harbor => [0, 5] },
     { :position => [4, 0], :type => :sea, :harbor => [0, 5] },
     { :position => [3, 0], :type => :sea, :harbor => [5] },
     { :position => [2, 1], :type => :sea, :harbor => [4, 5] },
     { :position => [1, 2], :type => :sea, :harbor => [4, 5] },
     { :position => [1, 3], :type => :land },
     { :position => [1, 4], :type => :land },
     { :position => [1, 5], :type => :land },
     { :position => [2, 5], :type => :land },
     { :position => [3, 5], :type => :land },
     { :position => [4, 4], :type => :land },
     { :position => [5, 3], :type => :land },
     { :position => [5, 2], :type => :land },
     { :position => [5, 1], :type => :land },
     { :position => [4, 1], :type => :land },
     { :position => [3, 1], :type => :land },
     { :position => [2, 2], :type => :land },
     { :position => [2, 3], :type => :land },
     { :position => [2, 4], :type => :land },
     { :position => [3, 4], :type => :land },
     { :position => [4, 3], :type => :land },
     { :position => [4, 2], :type => :land },
     { :position => [3, 2], :type => :land },
     { :position => [3, 3], :type => :land },
    ]

  def self.generate
    rolls = ROLLS.dup
    harbors = HARBORS.dup
    seas = SEAS.dup
    lands = LANDS.dup
    hexes_attributes = HEXES_ATTRIBUTES.dup

    10.times { harbors.shuffle! }
    10.times { lands.shuffle! }

    i = 0
    harbor_distribution = [:odd?, :even?].rand

    hexes_attributes.map do |hex_attributes|
      position = hex_attributes[:position]
      type = hex_attributes[:type]
      harbor = hex_attributes[:harbor]

      result = {}
      result[:position] = position

      if type == :sea
        result[:hex_type] = seas.shift
        if i.send(harbor_distribution)
          result[:harbor_type] = harbors.shift
          result[:harbor_position] = harbor.rand
        end
      else type == :land
        result[:hex_type] = lands.shift
        result[:roll] = rolls.shift unless result[:hex_type] == "desert"
      end
      i += 1
      result
    end
  end
end
