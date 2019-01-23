class Credential < ApplicationRecord
  belongs_to :user
  has_many :events

  validates :user, presence: true

  def valid_smtp?
    username.present?
  end
end
