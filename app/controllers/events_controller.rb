class EventsController < ApplicationController
  before_action :authenticate_user!

  def data
    @event = Event.find(params[:id])

    if @event.campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this!" 
      return
    end

    respond_to do |format|
      format.csv { send_data @event.data, filename: "event-#{@event.id}.csv" }
    end
  end

  def email
    @event = Event.find(params[:id])

    if @event.campaign.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this!" 
      return
    end

    render json: { subject: @event.subject, template: @event.template }
  end
end
