require 'active_record/acts/list'                  

if defined?(ActiveRecord) && !ActiveRecord.include?(ActiveRecord::Acts::List)
  ActiveRecord::Base.class_eval { include ActiveRecord::Acts::List }
end
