# -*- coding: utf-8 -*-

# Pioneers - web game based on the Settlers of Catan board game.
#
# Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

class Node < ActiveRecord::Base
  state_machine do
    event :settle do
      transition nil => :settlement
    end

    event :expand do
      transition :settlement => :city
    end

    before_transition :on => :settle, :do => :build_settlement
    before_transition :on => :expand, :do => :build_city
  end

  validates_presence_of :player, :board, :state
  validates_associated :player
  validates_uniqueness_of :board_id, :scope => [:row, :col]
  validate :proximity_of_land, :distance_from_settlements, :possesion_of_road, :player_not_changed

  belongs_to :board
  belongs_to :player

  after_save :save_player, :settlement_built

  delegate :game, :to => :board
  delegate :width, :height, :size, :nodes, :edges, :hexes, :to => :board, :prefix => true
  delegate :players, :first_settlement?, :second_settlement?, :after_roll?, :settlement_built!, :to => :game, :prefix => true
  delegate :nodes, :number, :to => :player, :prefix => true

  attr_reader :user

  def user=(user)
    @user = user
    self.player ||= user_player
  end

  def user_player
    game_players.find_by_user_id(user.id)
  end

  def self.find_by_position(position)
    find(:first, :conditions => { :row => position.first, :col => position.second })
  end

  def self.find_by_positions(positions)
    find(:all, :conditions => [%Q{(#{quoted_table_name}.row = ? AND #{quoted_table_name}.col = ?) OR } * positions.size + %Q{ 0 = 1}, *positions.flatten])
  end

  def position
    [row, col]
  end

  def position=(position)
    self.row, self.col = position
  end

  def hex_positions
    if col.odd?
      [[row - 1, col.div(2)], [row, col.div(2) - 1], [row, col.div(2)]]
    else
      [[row - 1, col.div(2)], [row - 1, col.div(2) - 1], [row, col.div(2) - 1]]
    end
  end

  def hexes
    board_hexes.find_by_positions(hex_positions)
  end

  def node_positions
    if col.odd?
      [[row, col + 1], [row, col - 1], [row + 1, col - 1]]
    else
      [[row - 1, col + 1], [row, col - 1], [row, col + 1]]
    end
  end

  def nodes
    board_nodes.find_by_positions(node_positions)
  end

  def edge_positions
    if col.odd?
      [[row, 3 * (col.div(2) + 1) + 1], [row, 3 * (col.div(2) + 1) - 1], [row, 3 * (col.div(2) + 1)]]
    else
      [[row - 1, 3 * col.div(2) + 3], [row, 3 * col.div(2) + 1], [row, 3 * col.div(2) + 2]]
    end
  end

  def edges
    board_edges.find_by_positions(edge_positions)
  end

  def add_resources(type)
    return if type.nil?
    amount = city? ? 2 : 1
    player[type] = player[type] + amount
  end

  def has_road?
    edges.detect { |edge| edge != nil and edge.player == player } != nil
  end

  def harbor?
    harbor_hex != nil
  end

  def harbor_type
    harbor_hex.harbor_type if harbor?
  end

  def to_json(options = {})
    hash = {
      :position => position,
      :player => player_number,
      :state => state,
      :id => id
    }
    ActiveSupport::JSON.encode(hash)
  end

  protected

  def harbor_hex
    hexes.detect { |hex| hex.harbor_on? position }
  end

  def add_resources_from_neighbours
    hexes.compact.each { |hex| add_resources(hex.resource_type) }
  end

  def add_victory_point
    player.visible_points = player.visible_points + 1
  end

  def save_player
    player.save
  end

  def update_exchange_rates
    harbor_types = %w(bricks grain lumber ore wool)
    if harbor_types.include? harbor_type
      player["#{harbor_type}_exchange_rate"] = 2
    else
      harbor_types.each { |harbor_type| player["#{harbor_type}_exchange_rate"] = 3 unless player["#{harbor_type}_exchange_rate"] < 3 }
    end
  end

  # validations

  def player_not_changed
    errors.add :player, "cannot be changed" if player != user_player
  end

  def position_settleable?
    hexes.detect { |hex| hex.settleable? if hex } != nil
  end

  def setup_phase?
    game_first_settlement? or game_second_settlement?
  end

  def possesion_of_road
    errors.add :position, "has no road" unless setup_phase? or has_road?
  end

  def proximity_of_land
    errors.add :position, "is not settleable" unless position_settleable?
  end

  def position_open?
    nodes.compact.empty?
  end

  def distance_from_settlements
    errors.add :position, "is too close to another settlement" unless position_open?
  end

  # settlement - before validation
  def build_settlement
    return if @settlement_built
    player.settlements = player.settlements - 1
    add_resources_from_neighbours if game_second_settlement?
    charge_for_settlement if game_after_roll?
    update_exchange_rates if harbor?
    add_victory_point
    @settlement_built = true
  end

  def charge_for_settlement
    player.bricks = player.bricks - 1
    player.grain = player.grain - 1
    player.lumber = player.lumber - 1
    player.wool = player.wool - 1
  end

  # city - before validation
  def build_city
    return if @city_built
    player.settlements = player.settlements + 1
    player.cities = player.cities - 1
    charge_for_city
    add_victory_point
    @city_built = true
  end

  def charge_for_city
    player.ore = player.ore - 3
    player.grain = player.grain - 2
  end

  def settlement_built
    game_settlement_built!(user)
  end
end
