# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_pioneers-ng_session',
  :secret      => '7079f09844c5ae6cdf71e613bb5cd96f90d1982247a09ffeb8ebeb2cbf7b34bf3e7a8fd2fcefbfca6d9cd2c01486d6c1eca2fc4287e100cd9b6d70eaec428ad6'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
