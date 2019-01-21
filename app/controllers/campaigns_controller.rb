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
    params.permit(:name, :status, :template, :data)
  end
end
