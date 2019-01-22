class CredentialsController < ApplicationController
  before_action :authenticate_user!

  def index
    @credentials = current_user.credentials
  end

  def create
    credential = Campaign.new(campaign_params)
    credential.user_id = current_user.id

    if credential.save
      render status: 200, json: { success: true, message: "You have successfully created a new credential!" }
    else
      render status: 400, json: { success: false, message: credential.errors.full_messages }
    end
  end

  private

  def credential_params
    params.permit(:smtp_server, :name, :smtp_port, :username, :password)
  end
end
