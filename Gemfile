source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Important
gem 'rails'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma'
gem 'faker'
gem 'mailgun-ruby'
gem 'config'
gem 'byebug'
gem 'pry-rails'

# Authentication
gem 'devise'

# Frontend
gem "haml-rails"
gem 'bootstrap', '~> 4.1.3'
gem 'sassc-rails'
gem 'bootswatch'
gem 'jquery-rails'
gem 'uglifier'
gem 'coffee-rails'
gem 'jquery-datatables'
gem 'jbuilder'
gem 'toastr-rails'
gem "font-awesome-rails"
gem 'turbolinks'
gem 'quilljs-rails'


group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'capybara'
  gem 'selenium-webdriver'
end

group :development do
  gem 'web-console'
  gem 'listen'
  gem 'spring'
  gem 'spring-watcher-listen'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
