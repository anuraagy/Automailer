class CredentialsController < ApplicationController
  before_action :authenticate_user!

  def index
    @credentials = current_user.credentials
  end

  def create
    credential = Credential.new(credential_params)
    credential.user_id = current_user.id

    if credential.save
      render status: 200, json: { success: true, message: "You have successfully created a new credential!" }
    else
      render status: 400, json: { success: false, message: credential.errors.full_messages }
    end
  end

  def show
    @credential = Credential.find(params[:id])
    verify_permissions
  end

  def update
    @credential = Credential.find(params[:id])

    verify_permissions

    if @credential.update(credential_params)
      redirect_to credential_path(@credential), notice: "You've successfully updated your credentials!"
    else
      render credential_path(@credential), notice: @credential.errors.full_messages
    end
  end

  def destroy
    @credential = Credential.find(params[:id])

    verify_permissions

    if @credential.destroy
      redirect_to credentials_path, notice: "Your credential has been successfully deleted."
    else
      redirect_to credentials_path, notice: "You can't delete this credential." 
    end    
  end


  private

  def credential_params
    params.require(:credential).permit(:name, :provider, :username)
  end

  def verify_permissions
    if @credential.user_id != current_user.id
      redirect_to root_path, alert: "You can't access this!" 
      return
    end
  end
end
