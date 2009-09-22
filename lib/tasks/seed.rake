namespace :db do
  task :seed => :environment do
    load "db/seed.rb"
  end
end
