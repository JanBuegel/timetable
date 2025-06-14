require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database_file, 'config/database.yml'

class Event < ActiveRecord::Base
end

get '/events' do
  content_type :json
  Event.all.to_json
end

post '/events' do
  event = Event.create(JSON.parse(request.body.read))
  event.to_json
end

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end
