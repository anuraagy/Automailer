class CreateCampaigns < ActiveRecord::Migration[5.2]
  def change
    create_table :campaigns do |t|
      t.string :name,     null: false, default: "New Campaign"
      t.string :subject
      t.text   :template
      t.text   :data

      t.belongs_to :user, null: false
      t.timestamps
    end
  end
end
