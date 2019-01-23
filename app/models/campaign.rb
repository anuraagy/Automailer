class Campaign < ApplicationRecord
  has_many_attached :attachments, dependent: :destroy
  has_many :events

  belongs_to :user

  validates :name, presence: true
  validates :user, presence: true


  def run(credential)
    return { success: false, message: "Invalid credentials" } unless valid_credential?(credential) 

    event = Event.new(campaign_id: id, template: template, data: data, credential_id: credential.id, subject: subject, status: "Created")

    if event.save
      return event.start
    else
      return { success: false, message: event.errors.full_messages } 
    end
  end

  def file_paths
    attachments.includes(:blob).map { |attachment| { path: ActiveStorage::Blob.service.send(:path_for, attachment.key), name: attachment.blob.filename.to_s } }
  end

  def valid_credential?(credential)
    credential.valid_smtp? && credential.user == user
  end
end
