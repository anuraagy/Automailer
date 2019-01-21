Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  root to: "pages#index"

  resources :campaigns, only: [:create, :show, :edit, :update, :destroy]
end
