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

    uploaded_io = params[:csv_data].read.gsub("\xEF\xBB\xBF", "");

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
    else
      render status: 200, json: { attachments: @campaign.attachments.includes(:blob).as_json(include: [:blob])}
    end
  end

  def remove_file
    @campaign = Campaign.find(params[:id])
    @file = @campaign.attachments.find(params[:file])

    if @file.destroy
      render status: 200, json: { success: true, message: "File successfully destroyed" }
    else
      render status: 400, json: { success: false, message: "There was an error with your destruction" }
    end
  end

  def update
    campaign = Campaign.find(params[:id])

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
    end

    if campaign.destroy
      redirect_to root_path, notice: "Your campaign has been successfully deleted."
    else
      redirect_to root_path, notice: "You can't delete this campaign." 
    end    
  end

  private

  def campaign_params
    params.permit(:name, :status, :template, :data, attachments: [])
  end

  def has_email_header(data)
    return false if data.blank?

    headers = CSV.parse(data, headers: true).headers.map { |header| header.parameterize.underscore}
    headers.include?("email")
  end
end
