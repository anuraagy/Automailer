class Event < ApplicationRecord
  belongs_to :campaign
  belongs_to :credential

  validates :template,  presence: true
  validates :data,      presence: true

  def start
    if data.blank?
      return { success: false, message: "Please upload data to send emails!" } 
    end
    
    emails = []
    subjects = []
    templates = []
    files = campaign.file_paths

    rows = CSV.parse(data, headers: true)
    headers = rows.headers

    rows.each_with_index do |row, index|
      subjects[index] = subject
      templates[index] = template.gsub("<p><br></p>", "")

      headers.each do |header|
        cleanHeader = header.parameterize.underscore

        if cleanHeader == "email"
          if !valid_email?(row[header])
            return { success: false, message: "You seem to have invalid emails in your CSV. Please reupload and try again!" } 
          end

          emails << row[header]
        end 

        subjects[index] = subjects[index].gsub("{{#{cleanHeader}}}", row[header]) 
        templates[index] = templates[index].gsub("{{#{cleanHeader}}}", row[header]) 
      end
    end

    send_email = EmailService.bulk_email(credential, emails, subjects, templates, files)

    if send_email[:success]
      return { success: true }
    else
      return { success: false, message: send_email[:message] }
    end
  end


  def valid_email?(email)
    email.match(URI::MailTo::EMAIL_REGEXP).present?
  end
end
