class LoginsController < ApplicationController
  layout "welcome_layout"

  def welcome
    redirect_to app_url if current_user
    render :welcome
  end

  def oauth
    @user = User.find_or_create_from_auth_hash(auth_hash)
    login!(@user)
    redirect_to root_path
  end

end
