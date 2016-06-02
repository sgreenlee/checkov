Rails.application.routes.draw do

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  root to: "static_pages#root", as: "home"

  namespace :api, defaults: {format: :json } do

    resource :users, only: [:create, :update]
    resource :session, only: [:create, :destroy, :show]

    resources :teams, only: [:create, :update, :index, :show] do

      resources :members, only: [:index, :create]

    end

  end
end
