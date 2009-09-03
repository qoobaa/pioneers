# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.3' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')
require "set"

Rails::Initializer.run do |config|
  config.gem "authlogic"
  config.gem "bunny"
  config.gem "chriseppstein-compass", :lib => "compass"
  config.gem "haml"
  config.gem "json"
  config.gem "pager-acts_as_list", :lib => "active_record/acts/list"
  config.gem "state_machine"

  config.time_zone = 'UTC'
end
