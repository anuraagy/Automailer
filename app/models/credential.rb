class Credential < ApplicationRecord
  belongs_to :user
  has_many :events

  validates :user,      presence: true
  validates :username,  presence: true
  validates :provider,  presence: true, :inclusion=> { :in => ["Google", "Outlook"] }

  attr_accessor :password

  def valid_smtp?
    username.present?
  end

  def smtp_server
    return "smtp.gmail.com" if provider == "Google"
    return "smtp-mail.outlook.com" if provider == "Outlook"
  end

  def smtp_port
    587
  end
end
