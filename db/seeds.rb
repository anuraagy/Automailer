# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user_params = {
  name: "Anuraag Yachamaneni",
  email: "ayachamaneni@gmail.com",
  password: "password",
  confirmed_at: Time.now
}

User.create!(user_params)

5.times { Campaign.create(name: Faker::OnePiece.location, user_id: User.first.id) }