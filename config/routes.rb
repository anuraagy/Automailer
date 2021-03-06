Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  root to: "pages#index"

  resources :campaigns, only: [:create, :show, :edit, :update, :destroy] do 
    post "run",  on: :member, as: "run"

    post "upload",        on: :member, as: "upload"
    post "attach_file",   on: :member, as: "attach_file"
    post "remove_file",   on: :member, as: "remove_file"

    get  "attachments",   on: :member, as: "attachments"
  end

  resources :events, only: [] do 
    get "data",  on: :member, as: "data"
    get "email", on: :member, as: "email"
  end

  resources :credentials, only: [:index, :create, :show, :update, :destroy]
end
