FROM ruby:3.1
WORKDIR /app
COPY ruby-app/Gemfile ruby-app/Gemfile.lock* ./
RUN bundle install
COPY ruby-app .
CMD ["bundle", "exec", "ruby", "app.rb", "-p", "4567", "-o", "0.0.0.0"]
