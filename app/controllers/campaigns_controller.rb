class CampaignsController < ApplicationController
  before_action :authenticate_user!

  def create
    campaign = Campaign.new(campaign_params)
    campaign.user_id = current_user.id

    if campaign.save
      render status: 200, json: { success: true, message: "You have successfully created a campaign!" }
    else
      render status: 400, json: { success: false, message: campaign.errors.full_messages }
    end
  end

  def show
    @campaign = Campaign.find(params[:id])
    @credentials = current_user.credentials

    if @campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this campaign" 
    end
  end

  def upload
    @campaign = Campaign.find(params[:id])

    if @campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this campaign" 
      return
    end

    uploaded_io = params[:csv_data].read

    uploaded_io.gsub!("\xEF\xBB\xBF", "") if uploaded_io.encoding

    if !has_email_header(uploaded_io)
      redirect_to campaign_path(@campaign)+ "#data", alert: "You need to have an email column in your CSV!"
      return
    end

    if @campaign.update(data: uploaded_io)
      redirect_to campaign_path(@campaign) + "#data"
    else
      render campaign_path(@campaign) + "#data", alert: "There is something wrong with your file. Please try again."
    end
  end

  def attach_file
    @campaign = Campaign.find(params[:id])

    if @campaign.user_id != current_user.id
      render status: 401, json: { success: false, message: "You do not have access to this campaign"} 
      return
    end

    @campaign.attachments.attach(params[:attachments])

    if @campaign.attachments.attached?
      render status: 200, json: { success: true, message: "Files successfully attached" }
    else
      render status: 400, json: { success: false, message: "There was an error with your upload" }
    end
  end

  def attachments 
    @campaign = Campaign.find(params[:id])

    if @campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this campaign" 
      return
    else
      render status: 200, json: { attachments: @campaign.attachments.includes(:blob).as_json(include: [:blob])}
    end
  end

  def remove_file
    @campaign = Campaign.find(params[:id])
    @file = @campaign.attachments.find(params[:file])

    if @campaign.user_id != current_user.id
      render status: 401, json: { success: false, message: "You do not have access to this campaign"} 
      return
    end

    if @file.destroy
      render status: 200, json: { success: true, message: "File successfully destroyed" }
    else
      render status: 400, json: { success: false, message: "There was an error with your destruction" }
    end
  end

  def run
    @campaign = Campaign.find(params[:id])
    @credential = Credential.find(params[:credential])
    @credential.password = params[:password]

    if @campaign.user_id != current_user.id
      render status: 401, json: { success: false, message: "You do not have access to this campaign"}
      return
    end
    
    @run = @campaign.run(@credential)
    
    if @run[:success] 
      render status: 200, json: { success: true, message: "Your campaign ran successfully!" }
    else
      render status: 400, json: { success: false, message: @run[:message] }
    end

  end

  def update
    campaign = Campaign.find(params[:id])

    if campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this campaign." 
      return
    end

    if campaign.update(campaign_params)
      render status: 200, json: { success: true, message: "You have successfully updated your campaign."}
    else
      render status: 400, json: { success: false, message: campaign.errors.full_messages }
    end
  end

  def destroy
    campaign = Campaign.find(params[:id])

    if campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this campaign." 
      return
    end

    if campaign.destroy
      redirect_to root_path, notice: "Your campaign has been successfully deleted."
    else
      redirect_to root_path, notice: "You can't delete this campaign." 
    end    
  end

  private

  def campaign_params
    params.permit(:name, :template, :data, :subject, attachments: [])
  end

  def has_email_header(data)
    return false if data.blank?

    csv = CSV.parse(data, headers: true)

    return false if csv.headers.blank?

    headers = csv.headers.map { |header| header.parameterize.underscore}
    headers.include?("email")
  end
end
