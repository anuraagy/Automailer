class Campaign < ApplicationRecord
  belongs_to :user
  has_many_attached :attachments

  validates :name, presence: true
end
