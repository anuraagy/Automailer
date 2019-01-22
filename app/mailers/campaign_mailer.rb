class CampaignMailer < ApplicationMailer
  def event_email
    @credential = params[:credential]
    @attachments = params[:attachments]

    attachments = build_attachments

    mail(
      from: params[:from],
      to: params[:to],
      subject: params[:subject],
      delivery_method_options: delivery_options
    ) do |format| 
      format.html { params[:body] }
    end

  end

  private

  def delivery_options
    { 
      user_name: @credential.username,
      password: @credential.password,
      address: @credential.smtp_server,
      port: @credential.smtp_port
    }
  end

  def build_attachments
    @attachments.each do |attachment|
      attachments[attachment[:name]] = attachment[:path]
    end
  end
end
