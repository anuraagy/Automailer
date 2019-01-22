class Credential < ApplicationRecord
  belongs_to :user
  has_many :events

  def valid_smtp?
    smtp_server.present? && smtp_port.present? && username.present? && password.present?
  end
end
