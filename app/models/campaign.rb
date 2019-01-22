class Campaign < ApplicationRecord
  has_many_attached :attachments
  has_many :events
  belongs_to :user

  validates :name, presence: true

  def run(credential)
    if data.blank?
      return { success: false, message: "Please upload data to send emails!" } 
    end
    
    rows = CSV.parse(data, headers: true)
    headers = rows.headers
    templates = []

    rows.each_with_index do |row, index|
      templates[index] = template

      headers.each do |header|
        cleanHeader = header.parameterize.underscore

        if cleanHeader == "email" && !valid_email?(row[header])
          return { success: false, message: "You seem to have invalid emails in your CSV. Please reupload and try again!" } 
        end

        templates[index] = templates[index].gsub("{{#{}}}", row[header]) 
      end
    end

    

    return { success: true }
  end

  def valid_email?(email)
    email.match(URI::MailTo::EMAIL_REGEXP).present?
  end
end
