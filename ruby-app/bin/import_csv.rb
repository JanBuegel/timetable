#!/usr/bin/env ruby
ENV['RACK_ENV'] ||= 'development'

require 'csv'
require_relative '../app'

if ARGV.empty?
  abort("Usage: ruby bin/import_csv.rb <path_to_csv>")
end

csv_file = ARGV[0]

CSV.foreach(csv_file, headers: true) do |row|
  Event.create(
    name: row['name'] || row[0],
    date: row['date'] || row[1],
    time: row['time'] || row[2],
    stage: row['stage'] || row[3]
  )
end

puts "Imported events from #{csv_file}."

