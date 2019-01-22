class Event < ApplicationRecord
  belongs_to :campaign

  validates :template,  presence: true
  validates :data,      presence: true
end
