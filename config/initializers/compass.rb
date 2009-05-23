require 'compass'
# If you have any compass plugins, require them here.
Compass.configuration do |config|
  config.project_path = RAILS_ROOT
  config.sass_dir = "app/stylesheets"
  config.css_dir = "public/stylesheets/compiled"
  config.images_dir = "public/images"
  config.http_images_path = "/images"
end
Compass.configure_sass_plugin!
