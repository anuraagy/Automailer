class Event < ApplicationRecord
  belongs_to :campaign
  belongs_to :credential

  validates :template,  presence: true
  validates :data,      presence: true

  # This method starts the sending process for an event (commenting because it is complex)
  def start

    # This checks to make sure a user has uploaded data to be sent
    if data.blank?
      return { success: false, message: "Please upload data to send emails!" } 
    end
    
    # This is an initalization of the lists of items that will be sent to the mailer
    emails = []
    subjects = []
    templates = []
    files = campaign.file_paths

    # Parse the CSV and aquire the headers
    rows = CSV.parse(data, headers: true)
    headers = rows.headers

    # Iterate through the rows in the CSV
    rows.each_with_index do |row, index|
      # Seed the subjects and templates with the default data
      subjects[index] = subject
      templates[index] = template.gsub("<p><br></p>", "")

      # Iterate through each of the columsn in the row
      headers.each do |header|
        # Clean the header by parametrizing it and changing dashes to underscores
        cleanHeader = header.parameterize.underscore

        # Check if you are in the email column
        if cleanHeader == "email"
          # If you are in the email column, and the email is not a valid email, stop the sending process
          if !valid_email?(row[header])
            return { success: false, message: "You seem to have invalid emails in your CSV. Please reupload and try again!" } 
          end

          # Add the current email to email list
          emails << row[header]
        end 

        # Update the template at the proper index with the variables filled in
        subjects[index] = subjects[index].gsub("{{#{cleanHeader}}}", row[header]) 
        templates[index] = templates[index].gsub("{{#{cleanHeader}}}", row[header]) 
      end
    end

    # Calls email service to mass send the emails (or at least start the process)
    send_email = EmailService.bulk_email(credential, emails, subjects, templates, files)

    # If email sending process was started, return true, otherwise return false and message
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
