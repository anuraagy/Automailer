class EmailService
  def self.bulk_email(credential, emails, subjects, templates, files)
    if emails.blank? || subjects.blank? || templates.blank?
      return { success: false, message: "Please check to make sure that your emails, subject, and template are present!" } 
    end

    if emails.count != subjects.count || subjects.count != templates.count || emails.count != templates.count 
      return { success: false, message: "You don't have the proper number of emails/row, please fix this!" }
    end

    emails.each_with_index do |email, index|
      send_email(email, credential.username, subjects[index], templates[index], files, credential)
    end

    { success: true }
  end

  def self.send_email(to, from, subject, body, files, credential)
    CampaignMailer.with(to: to, from: from, subject: subject, body: body, attachments: files, credential: credential).event_email.deliver
  end
end