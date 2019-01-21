class CreateCampaigns < ActiveRecord::Migration[5.2]
  def change
    create_table :campaigns do |t|
      t.string :name,     null: false, default: "New Campaign"
      t.string :status,   null: false, default: "new"
      t.text   :template
      t.text   :data

      t.belongs_to :user
      t.timestamps
    end
  end
end
